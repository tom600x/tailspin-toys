import { createServer } from "node:http";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import { TRIAGE_ISSUES } from "./triage-data.mjs";
import { renderKanbanHtml } from "./render-html.mjs";

const servers = new Map();

function buildIssueContextPrompt(issue) {
  return `I would like to start working on Issue #${issue.number}: **${issue.title}**.

### Issue Details
- **Category / Area**: ${issue.category}
- **Priority**: ${issue.priority} (Rank #${issue.rank})
- **Description**: ${issue.description}
${issue.justification ? `- **Triage Justification**: ${issue.justification}` : ""}

### Acceptance Criteria
${issue.acceptanceCriteria.map(c => `- [ ] ${c}`).join("\n")}

Please review the codebase, plan the implementation following repository standards, and begin implementing the solution step-by-step. Make sure to run all quality checks and verify test coverage.`;
}

async function handleAddContext(session, issueNumber) {
  const issue = TRIAGE_ISSUES.find(i => i.number === Number(issueNumber));
  if (!issue) {
    throw new Error(`Issue #${issueNumber} not found.`);
  }

  const prompt = buildIssueContextPrompt(issue);

  // Surface notification in CLI timeline
  await session.log(`Added Issue #${issue.number} (${issue.title}) to session context.`, {
    level: "info",
    ephemeral: false
  });

  // Programmatically queue the prompt to start work
  setTimeout(() => {
    session.send({ prompt }).catch(() => {});
  }, 50);

  return { success: true, issueNumber: issue.number, title: issue.title };
}

async function startServer(instanceId, session) {
  const server = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, "http://127.0.0.1");

    if (url.pathname === "/" && req.method === "GET") {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(renderKanbanHtml(instanceId, TRIAGE_ISSUES));
      return;
    }

    if (url.pathname === "/api/issues" && req.method === "GET") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ issues: TRIAGE_ISSUES }));
      return;
    }

    if (url.pathname === "/api/add-context" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", async () => {
        try {
          const parsed = JSON.parse(body || "{}");
          const result = await handleAddContext(session, parsed.issueNumber);
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(result));
        } catch (err) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return { server, url: `http://127.0.0.1:${port}/` };
}

const session = await joinSession({
  canvases: [
    createCanvas({
      id: "kanban-board",
      displayName: "Work Triage Kanban Board",
      description: "Interactive Kanban board for triaging repository issues, highlighting top 3 priority tasks, and adding issues directly to the session context.",
      actions: [
        {
          name: "add_issue_to_context",
          description: "Add an issue and its full context into the current session to begin work immediately",
          inputSchema: {
            type: "object",
            properties: {
              issueNumber: {
                type: "number",
                description: "The issue number to add to session context"
              }
            },
            required: ["issueNumber"]
          },
          handler: async (ctx) => {
            const input = ctx.input || {};
            return await handleAddContext(session, input.issueNumber);
          }
        },
        {
          name: "get_triage_data",
          description: "Retrieve prioritized issues list with top 3 justifications and acceptance criteria",
          handler: async () => {
            return {
              topPriority: TRIAGE_ISSUES.filter(i => i.isTopPriority),
              backlog: TRIAGE_ISSUES.filter(i => !i.isTopPriority && i.state === "OPEN"),
              completed: TRIAGE_ISSUES.filter(i => i.state === "CLOSED")
            };
          }
        }
      ],
      open: async (ctx) => {
        let entry = servers.get(ctx.instanceId);
        if (!entry) {
          entry = await startServer(ctx.instanceId, session);
          servers.set(ctx.instanceId, entry);
        }
        return {
          title: "Work Triage Kanban Board",
          url: entry.url
        };
      },
      onClose: async (ctx) => {
        const entry = servers.get(ctx.instanceId);
        if (entry) {
          servers.delete(ctx.instanceId);
          await new Promise((resolve) => entry.server.close(() => resolve()));
        }
      }
    })
  ]
});

