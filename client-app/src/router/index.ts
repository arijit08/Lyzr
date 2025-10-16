import {createRouter, createWebHistory} from "vue-router";
import LoginView from "@/views/Login.vue";
import EditWorkflowView from "@/views/EditWorkflow.vue";
import WorkflowsView from "@/views/Workflows.vue";
import {EDIT_WORKFLOW_PATH, LOGIN_PATH, WORKFLOWS_PATH} from "@/config";





const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: LOGIN_PATH,
            name: 'login',
            component: LoginView,
            meta: { requiresAuth: false }
        },
        {
            path: WORKFLOWS_PATH,
            name: 'workflows',
            component: WorkflowsView,
            meta: { requiresAuth: true }
        },
        {
            path: EDIT_WORKFLOW_PATH + '/:id?',
            name: 'editworkflow',
            component: EditWorkflowView,
            meta: { requiresAuth: true }
        },
        {
            path: '/',
            redirect: EDIT_WORKFLOW_PATH
        }
    ],
});


// Global Navigation Guard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token');
    const requiresAuth = to.meta.requiresAuth;

    if (requiresAuth && !token) {
        // If authentication is required for the destination page but no token is present, redirect to login
        next(LOGIN_PATH);
    } else if (to.path == LOGIN_PATH && token) {
        // If destination is the login page but token already exists, redirect to edit workflow
        next(EDIT_WORKFLOW_PATH)
    }
    else {
        next();
    }
});

export default router;