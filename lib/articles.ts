export type Article = {
  slug: string;
  title: string;
  dek: string;
  seed: number;
  // Paragraphs; a string starting with "## " is a subheading.
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "latency-is-a-feeling",
    title: "Latency is a feeling",
    dek: "Users don't measure milliseconds. They measure doubt.",
    seed: 11,
    body: [
      "We talk about performance as if it were a number. Time to first byte, largest contentful paint, p99. These are useful instruments, but they measure the machine. The person on the other side of the screen is measuring something else entirely: how long they were left wondering whether anything was happening.",
      "A 300ms response that acknowledges a tap instantly feels faster than a 150ms response that gives no sign of life until it finishes. The first one is a conversation. The second is a silence that happens to end quickly. Humans are exquisitely sensitive to silence.",
      "## The budget is attention, not time",
      "Every interface spends the user's attention. A spinner spends it. A layout shift spends it twice: once on the jolt, once on finding their place again. An optimistic update spends almost nothing, because the user's model of the world and the screen's model of the world never disagree.",
      "This reframes the engineering question. Instead of asking how fast the server can answer, ask how soon the interface can stop being uncertain. Often the answer has nothing to do with the server. Prefetch on hover. Render the shape of the content before the content. Commit the user's intent locally and reconcile later.",
      "## Honesty still matters",
      "There is a cheap version of this idea, where you hide slowness behind animation and hope nobody notices. People notice. Perceived performance only works when the perception is true: the action really did register, the data really is on its way. Fake progress bars train people to distrust every progress bar.",
      "## Variance is worse than slowness",
      "A system that always takes a second is easier to live with than one that usually takes a hundred milliseconds and occasionally takes five seconds. People adapt to a steady rhythm. They build habits around it. What they cannot adapt to is unpredictability, because every interaction now carries a small question: is this one of the slow ones?",
      "This is why tail latency matters more than averages suggest. The p50 describes the experience you designed. The p99 describes the experience your most engaged users have every day, because the people who use a product most are the ones who hit its edges most often. Optimise the median and you please the casual visitor. Tame the tail and you keep the people who depend on you.",
      "It is also why the fix is often architectural rather than local. A slow query can be indexed. A request that fans out to six services, each with its own occasional hiccup, will inherit the worst of all six. Fewer hops, fewer dependencies in the critical path and sensible timeouts do more for the feeling of speed than any micro-optimisation inside a single function.",
      "The best fast software is not the one with the lowest number on a dashboard. It is the one where you never once wonder whether it heard you.",
    ],
  },
  {
    slug: "every-abstraction-is-a-loan",
    title: "Every abstraction is a loan",
    dek: "You borrow simplicity today and repay it in understanding later.",
    seed: 23,
    body: [
      "An abstraction lets you stop thinking about something. That is its entire value. An ORM lets you stop thinking about SQL. A framework lets you stop thinking about routing. A cloud service lets you stop thinking about machines. Each one hands you time you would otherwise have spent on detail.",
      "But the detail did not disappear. It was deferred. Somewhere, the thing you stopped thinking about is still happening, and one day it will behave in a way your abstraction did not predict. On that day, you pay back the loan, usually at the worst possible moment and with interest.",
      "## Interest compounds in layers",
      "One abstraction is cheap to see through. Five stacked abstractions are a different problem. When a query is slow in a system with an ORM on top of a connection pool on top of a proxy on top of a managed database, the debugging session begins with archaeology. Each layer was a reasonable decision. Together they form a debt nobody remembers signing.",
      "This is not an argument against abstraction. Software without abstraction is just a longer way of writing assembly. It is an argument for borrowing deliberately. Before adopting a layer, ask what it will cost to understand the layer beneath it when things go wrong, and whether anyone on the team can actually pay that cost.",
      "## Good abstractions have escape hatches",
      "The abstractions worth borrowing are the ones that let you step outside them without tearing everything down. A query builder that lets you drop to raw SQL. A component library that lets you override a style without forking. These are loans with flexible terms.",
      "The bad ones are total: they own the whole stack and offer no way down. They feel wonderful in the first month. They feel like a mortgage in the second year.",
      "## Who holds the debt",
      "The cruel part of abstraction debt is that the person who borrows is rarely the person who repays. The engineer who adopted the clever framework has often moved on by the time its edge cases surface. The repayment falls to whoever is on call, usually someone who never chose the layer and has no context for why it exists.",
      "This changes how a team should think about adoption. A new dependency is not a personal productivity tool. It is a liability shared with every future maintainer. The question is not whether you can understand it today, but whether a tired person at two in the morning, a year from now, can understand it well enough to fix a production incident.",
      "The healthiest teams I have seen treat this explicitly. They keep a short list of the layers they depend on and who understands each one. When nobody understands a layer anymore, that is treated as a risk, not a curiosity. Either someone learns it properly, or the team plans its removal before the debt is called in.",
      "Borrowing is how anything ambitious gets built. Just know the terms, and write them down where the next person will find them.",
    ],
  },
  {
    slug: "data-has-gravity",
    title: "Data has gravity",
    dek: "Systems don't grow around code. They grow around where the data lives.",
    seed: 37,
    body: [
      "Draw an architecture diagram of any mature system and you will find that the boxes cluster. Services huddle around the databases they read from. Teams huddle around the services they own. Over time, the shape of an organisation starts to look suspiciously like the shape of its data.",
      "This is data gravity. The more data accumulates in one place, the more expensive it becomes to move, and the more everything else bends toward it. Code is light; you can rewrite it in a weekend. Data is heavy. It carries history, references, assumptions baked into its shape that no one wrote down.",
      "## Where you put data first is a long decision",
      "Early in a project, choosing where data lives feels like an implementation detail. It is not. It is the closest thing software has to choosing a city's location. You can rebuild the streets later. You cannot easily move the river.",
      "This is why schema design deserves more care than almost any other early decision. A clumsy function costs you an afternoon. A clumsy table costs you every query, every migration, every service that touches it, for as long as the product exists.",
      "## Design for the move you hope never to make",
      "You cannot avoid gravity, but you can avoid being trapped by it. Keep identifiers stable and meaningless. Keep the boundaries between datasets explicit, so that a future split is a matter of drawing a line that already exists rather than discovering one. Record why a field exists, not just what it holds.",
      "## Integrations are where gravity bites",
      "Gravity is most visible at the edges, where your system meets someone else's. Every external integration is an agreement between two bodies of data with different shapes, different identifiers and different ideas about what a single record means. One system's shipment is another's container, and a third's line item.",
      "The temptation is to translate at the boundary and move on. The better move is to treat the translation itself as a first-class part of the system: versioned, logged and owned. When an upstream system changes a field at short notice, and it will, the difference between a quiet fix and a week of confusion is whether anyone can see exactly what was mapped, when and why.",
      "Multi-tenant systems amplify all of this. When many organisations share one schema, every column is a promise to all of them at once. A field added for one tenant becomes a field every tenant carries. Tenancy boundaries, like data boundaries, are cheapest to draw on day one and most expensive to retrofit.",
      "The goal is not to make data weightless. It is to make sure that when something finally needs to move, you can still lift it.",
    ],
  },
  {
    slug: "the-interface-is-the-argument",
    title: "The interface is the argument",
    dek: "Every screen makes a claim about what matters. Most make it by accident.",
    seed: 41,
    body: [
      "A settings page with forty toggles is making an argument: that all forty are equally important and that you, the user, should decide each one. A settings page with four toggles is making a different argument: that someone already thought hard about the other thirty-six.",
      "Interfaces are rhetoric. Size, order and position are claims. The biggest button says this is what you came for. The item at the top of a list says this matters most. The thing hidden in a menu says you probably will not need this. Users read these claims instantly, long before they read any text.",
      "## Accidental arguments",
      "The trouble is that most interfaces make their arguments by accident. A feature lands at the top of the page because it was built most recently. A button is large because the component library's default is large. Over years, the screen becomes a transcript of the order in which things were shipped, not a statement of what the product believes.",
      "Good design is largely the work of making those arguments on purpose. It means deciding, explicitly, what the one important thing on each screen is, and then letting everything else get quieter. That is a product decision disguised as a visual one.",
      "## Restraint is a position",
      "Minimal interfaces are sometimes described as an aesthetic. They are better understood as a position: a willingness to say that some things matter less than others, and to accept the cost of being wrong about it.",
      "## Watch where people hesitate",
      "The fastest way to find out what an interface is really arguing is to sit next to someone using it. Not a usability lab, just a real person doing their real job. Watch where their cursor pauses. Watch where they reach for a notebook, a spreadsheet or a colleague. Each hesitation is a place where the screen's argument and the user's reality disagree.",
      "These moments rarely show up in analytics. A dashboard can tell you that a page was visited; it cannot tell you that the person on it was double-checking every number against a printout because they did not trust the system yet. Trust is built, or lost, in exactly those pauses.",
      "Software built for operations teams makes this especially clear. When an approval sits in the wrong place in a list, a shipment waits. When a status label is ambiguous, someone phones someone else to confirm it. The cost of an accidental argument is measured in phone calls, and phone calls are invisible to the people who designed the screen.",
      "An interface that refuses to choose is still arguing. It is just arguing that nobody was willing to decide.",
    ],
  },
  {
    slug: "boring-is-a-feature",
    title: "Boring is a feature",
    dek: "The most exciting thing a system can do is nothing unexpected.",
    seed: 53,
    body: [
      "Engineers are drawn to novelty for good reasons. New tools often are better. But a production system is not a showcase. It is a promise to the people who depend on it that tomorrow will look like today.",
      "Mature technology is boring precisely because its failure modes have been found, documented and argued about on forums for a decade. When Postgres misbehaves, someone has seen it before. When the framework released last month misbehaves, you may be the first.",
      "## Spend novelty where it earns something",
      "Every team has a limited budget for the unknown. Spend it on the part of the product that actually differentiates you. If your product is a novel editor, a novel rendering approach may be worth the risk. A novel queue, auth system and deployment pipeline under that editor are almost certainly not.",
      "The question to ask of any new dependency is not whether it is better, but whether it is better enough to justify being among the first to discover how it breaks.",
      "## Boring frees attention",
      "There is a quieter benefit. When the infrastructure is boring, nobody has to think about it. That attention flows back to the problems users actually care about. Excitement in the foundation is paid for with distraction everywhere above it.",
      "## Boring is a skill, not a default",
      "None of this means boring systems happen by accident. Making something boring takes deliberate work: sensible defaults, good alerts that fire rarely and mean something, runbooks that are actually current, and deployments so routine that nobody gathers to watch them. Boring is what competence looks like from the outside.",
      "It also means resisting the urge to rewrite things that work. A rewrite resets a system's accumulated knowledge of its own failure modes to zero. The old code may be ugly, but every strange conditional in it is a scar from a real incident. Throwing it away throws away the lessons, and the lessons will have to be relearned, usually in production.",
      "There is a place for excitement. It belongs in what users see and feel: a workflow that suddenly takes one step instead of five, a report that answers the question before it is asked. Spend boldness there. Underneath, choose the tools that let you sleep.",
      "The best compliment a system can receive is that nobody has mentioned it in months.",
    ],
  },
  {
    slug: "the-case-for-deleting-code",
    title: "The case for deleting code",
    dek: "Lines of code are not an asset. They are inventory, and inventory spoils.",
    seed: 67,
    body: [
      "We measure progress by what we add: features shipped, commits made, files created. Rarely does anyone celebrate a pull request that removes two thousand lines. Yet that pull request may be the most valuable thing merged all quarter.",
      "Every line of code is a liability with a small, permanent cost. It must be read by the next person, compiled, tested, upgraded when its dependencies change and reasoned about when something nearby breaks. Code that no longer earns its keep keeps charging rent anyway.",
      "## Why deletion is hard",
      "Deleting is harder than writing because it requires certainty. To add a feature, you need to know what you want. To remove one, you need to know who still relies on it, and that knowledge is usually scattered across logs, memories and a customer nobody has heard from in a year.",
      "So code accumulates. Flags that were meant to last a week last three years. Fallback paths for browsers nobody uses stay just in case. Each one is individually harmless. Together they make the codebase slower to change, which is the only kind of slow that really matters.",
      "## Make removal a habit",
      "Treat deletion as normal work, not cleanup. When a feature launches, schedule the removal of its flag. When a migration finishes, delete the old path in the same week. Measure the codebase's health partly by how easily things can leave it.",
      "## Deletion as design",
      "There is a deeper version of this habit that happens before any code is written. Every feature request carries an implicit question: could the need be met by removing something instead of adding something? A confusing settings page is often fixed by deleting half the settings. A slow workflow is often fixed by deleting a step that existed only to work around an older limitation.",
      "This is uncomfortable because it requires saying no to things that someone once asked for. But products that only ever grow become museums of past decisions, each exhibit defended by whoever remembers why it was added. The people who suffer are new users, who must learn the whole museum before they can do anything useful.",
      "AI-assisted coding makes this more urgent, not less. Generating code is now almost free. Understanding it, reviewing it and living with it are not. When the cost of writing falls to zero, the discipline of keeping a codebase small becomes the main thing separating systems that stay changeable from systems that quietly calcify.",
      "The goal is not less code for its own sake. It is a system where everything that remains is there because someone, recently, decided it should be.",
    ],
  },
];

export function readingMinutes(article: Article) {
  const words = article.body.join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
