# Lyzr - AGENT ORCHESTRATION PLATFORM with HUMAN-IN-THE-LOOP CAPABILITY AND PAUSE/REPLAY STATE MANAGEMENT

DISCLAIMER: This project is currently incomplete, please go through the planned modules VS what is present to decide if you'd like to continue giving your time:


PLANNED MODULES:
1. LOGIN PAGE - DONE
2. WORKFLOWS PAGE - NOT DONE
3. EDIT WORKFLOW PAGE - PARTLY DONE
4. COMPONENTS/NODES TO ADD TO WORKFLOW - PARTLY DONE
5. BACKEND AUTHENTICATION JW TOKEN - DONE
6. BACKEND DATABASE - NOT DONE :(
7. TASK RUNNER - NOT DONE
8. HITL CAPABILITY - NOT DONE

VIDEO WALKTHROUGH - https://drive.google.com/file/d/1ra6TlDHWQZixg2ril6HX9MYTxkvhFYpo/view?usp=sharing


## Design decision making

I went with a Node.js backend, Vue.js frontend, PostgreSQL db stack. A large part of frontend has been implemented, but unfortunately the DB part hasn't been implemented at all. Thus, it's an incomplete project

- Why Js stack? - to not only enforce event driven async parallel design, but also ensure the code remains intuitive. Also it's one of the faster stacks since the project isn't graphics heavy.
- Why Vue.js? Easy reactive components mean that the code is easily manageable. Vue Flow provides an excellent and intuitive graph visualization tool. Finia provides easy and robust state management and seamless real-time integration with the Vue Flow element. Also personally it's simpler, I had a buggy experience with Next.js, etc. Vue's documentation is quiet good as well
- Why Fastify? Built in schema validation (used extensively) along with Ts (which works seamelessly with Fastify), etc. to ensure robustness and resilience, it's also faster than Express. It's jwt, cors, etc. "plugins" make development and code management extremely simple
- Why PostgreSQL? ACID compliance i.e. resilient especially because the project was planned with the pause-replay feature and error recovery was non negotiable, so stuck to ACID compliant solutions. It's JSONB datatype makes it simple to store unstructured data like the state, considering the node properties, outputs, etc. are dynamic.
- Why REDIS? For meta data and caching only, not for storing the state


## How to run

1. Navigate to lyzr\ and run `npm run dev` to quickly launch the server
2. Navigate to lyzr\client-app\ and run `npm run dev` to quickly launch the Vue application
3. Navigate to `http://localhost:5173` on your browser
4. Login with `hari.hara` and password `12345678`

Stengths of this project:
1. 100% event driven design, async execution, resilient design
     The reason for going with Js over, for Ex: python, was simply how intuitively it supports async/event driven programming. Every function call is asynchronous, utilizing Vue.js's capabilities such as reactive components, etc. Care has been taken to avoid any circular dependencies. Although it isn't visible at this stage, but everything from the naming of objects to use of components, placement of methods in classes, compliance with event driven design, etc. have been done to implement Domain Driven Design (DDD) principles such as ubiquitous language, domain inspired modelling, etc.
2. 100% configurable front end structure
     All building blocks are separated into components, the code for the service layer is separated from the view layer, which is separated from configuration files, custom node definitions, etc. There is a generic node structure which custom nodes "extend" in a way. Every request/response is represented by schemas, the project is 100% typescript
3. 100% scalable and extensible
     The design has been chosen to be scalable from the start, including the use of components, allowing easy extension of nodes, allowing the addition of properties to nodes, the listing of nodes in the UI (Ex: simply create a new component in the components folder, it'll show up in the Components panel, extend the base node using it to avoid repititive boilerplate code, etc.). This is also seen by the use of tailwindcss for styling. At the backend, the use of routers and other Fastify features, including easy jwt authentication, allow for easy scaling
4. UI with drag-and-drop, intuitive, simple interface
5. API first architecture, easily implemented as dockerized micro services

Weakness:
1. Missing task executor, HITL system, retry/replay/pause system
2. Nodes not fully implemented
3. Slack/Gmail integration pending
4. DB layer not implemented
5. Could not push a deployable/lean version due to want of time


