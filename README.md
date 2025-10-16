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

## Design decision making

I went with a Node.js backend, Vue.js frontend, PostgreSQL db stack. A large part of frontend has been implemented, but unfortunately the DB part hasn't been implemented at all. Thus, it's an incomplete project


## How to run

1. Navigate to lyzr\ and run `npm run dev` to quickly launch the server
2. Navigate to lyzr\client-app\ and run `npm run dev` to quickly launch the Vue application
3. Navigate to `http://localhost:5173` on your browser
4. Login with `hari.hara` and password `12345678`

Stengths of this project:
1. 100% event driven design
     The reason for going with Js over, for Ex: python, was simply how intuitively it supports async/event driven programming. Every function call is asynchronous, utilizing Vue.js's capabilities such as reactive components, etc.
2. 100% configurable front end structure
     All building blocks are separated into components, the code for the service layer is separated from the view layer, which is separated from configuration files, custom node definitions, etc. There is a generic node structure which custom nodes "extend" in a way. Every request/response is represented by schemas, the project is 100% typescript
3. 100% scalable
