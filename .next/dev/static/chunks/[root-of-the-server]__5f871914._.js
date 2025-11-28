(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/Documents/MoveOn/components/DashboardHeader.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/next/link.js [client] (ecmascript)");
;
;
function DashboardHeader({ nome }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: '1px solid #eee',
            marginBottom: 24
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontWeight: 700,
                        color: '#1976d2',
                        fontSize: 20
                    },
                    children: "MoveOn"
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                    lineNumber: 7,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                lineNumber: 6,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                style: {
                    display: 'flex',
                    gap: 18
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard-paciente",
                        style: {
                            color: '#1976d2',
                            fontWeight: 700,
                            textDecoration: 'underline'
                        },
                        children: "Dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/tasks",
                        style: {
                            color: '#444'
                        },
                        children: "Tarefas"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/profile",
                        style: {
                            color: '#444'
                        },
                        children: "Perfil"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                        lineNumber: 12,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/settings",
                        style: {
                            color: '#444'
                        },
                        children: "Configurações"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                        lineNumber: 13,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontWeight: 500
                    },
                    children: nome || 'Paciente'
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                    lineNumber: 16,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
                lineNumber: 15,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/MoveOn/components/DashboardHeader.js",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = DashboardHeader;
var _c;
__turbopack_context__.k.register(_c, "DashboardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/components/CardBoasVindas.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CardBoasVindas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
function CardBoasVindas({ nome, proximoAgendamento, progresso }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)',
            color: '#fff',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                style: {
                    margin: 0,
                    fontWeight: 700
                },
                children: [
                    "Olá, ",
                    nome || 'Paciente',
                    "!"
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                lineNumber: 4,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    margin: '8px 0 16px 0',
                    fontSize: 16
                },
                children: "Bem-vindo(a) ao MoveOn! Continue com seus exercícios e acompanhe sua evolução."
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                lineNumber: 5,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 32,
                    flexWrap: 'wrap'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            minWidth: 180
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 500
                                },
                                children: "Próximo Agendamento:"
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                                lineNumber: 8,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 15,
                                    marginTop: 4
                                },
                                children: proximoAgendamento || 'Nenhum agendamento futuro.'
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                                lineNumber: 9,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                        lineNumber: 7,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            minWidth: 180
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 500
                                },
                                children: "Progresso Geral:"
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                                lineNumber: 12,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 15,
                                    marginTop: 4
                                },
                                children: progresso || '0% do Plano Concluído'
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                                lineNumber: 13,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
                lineNumber: 6,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/MoveOn/components/CardBoasVindas.js",
        lineNumber: 3,
        columnNumber: 5
    }, this);
}
_c = CardBoasVindas;
var _c;
__turbopack_context__.k.register(_c, "CardBoasVindas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
// Regiões detalhadas para visão anterior
const regioesAnterior = [
    {
        id: 'cabeca',
        label: 'Cabeça',
        cx: 110,
        cy: 40
    },
    {
        id: 'pescoco',
        label: 'Pescoço',
        cx: 110,
        cy: 65
    },
    {
        id: 'ombroE',
        label: 'Ombro Esquerdo',
        cx: 80,
        cy: 75
    },
    {
        id: 'ombroD',
        label: 'Ombro Direito',
        cx: 140,
        cy: 75
    },
    {
        id: 'bracoE',
        label: 'Braço Esquerdo',
        cx: 75,
        cy: 110
    },
    {
        id: 'bracoD',
        label: 'Braço Direito',
        cx: 145,
        cy: 110
    },
    {
        id: 'cotoveloE',
        label: 'Cotovelo Esquerdo',
        cx: 75,
        cy: 135
    },
    {
        id: 'cotoveloD',
        label: 'Cotovelo Direito',
        cx: 145,
        cy: 135
    },
    {
        id: 'antebracoE',
        label: 'Antebraço Esquerdo',
        cx: 75,
        cy: 160
    },
    {
        id: 'antebracoD',
        label: 'Antebraço Direito',
        cx: 145,
        cy: 160
    },
    {
        id: 'maoE',
        label: 'Mão Esquerda',
        cx: 75,
        cy: 185
    },
    {
        id: 'maoD',
        label: 'Mão Direita',
        cx: 145,
        cy: 185
    },
    {
        id: 'dedosMaoE',
        label: 'Dedos da Mão Esquerda',
        cx: 75,
        cy: 200
    },
    {
        id: 'dedosMaoD',
        label: 'Dedos da Mão Direita',
        cx: 145,
        cy: 200
    },
    {
        id: 'torax',
        label: 'Tórax',
        cx: 110,
        cy: 90
    },
    {
        id: 'quadril',
        label: 'Quadril',
        cx: 110,
        cy: 140
    },
    {
        id: 'coxaE',
        label: 'Coxa Esquerda',
        cx: 95,
        cy: 170
    },
    {
        id: 'coxaD',
        label: 'Coxa Direita',
        cx: 125,
        cy: 170
    },
    {
        id: 'joelhoE',
        label: 'Joelho Esquerdo',
        cx: 95,
        cy: 200
    },
    {
        id: 'joelhoD',
        label: 'Joelho Direito',
        cx: 125,
        cy: 200
    },
    {
        id: 'panturrilhaE',
        label: 'Panturrilha Esquerda',
        cx: 95,
        cy: 230
    },
    {
        id: 'panturrilhaD',
        label: 'Panturrilha Direita',
        cx: 125,
        cy: 230
    },
    {
        id: 'peE',
        label: 'Pé Esquerdo',
        cx: 95,
        cy: 260
    },
    {
        id: 'peD',
        label: 'Pé Direito',
        cx: 125,
        cy: 260
    },
    {
        id: 'dedosPeE',
        label: 'Dedos dos Pés Esquerdo',
        cx: 95,
        cy: 275
    },
    {
        id: 'dedosPeD',
        label: 'Dedos dos Pés Direito',
        cx: 125,
        cy: 275
    }
];
// Regiões detalhadas para visão posterior
const regioesPosterior = [
    {
        id: 'cabeca',
        label: 'Cabeça',
        cx: 110,
        cy: 40
    },
    {
        id: 'cervical',
        label: 'Cervical (Pescoço)',
        cx: 110,
        cy: 65
    },
    {
        id: 'ombroE',
        label: 'Ombro Esquerdo',
        cx: 80,
        cy: 75
    },
    {
        id: 'ombroD',
        label: 'Ombro Direito',
        cx: 140,
        cy: 75
    },
    {
        id: 'bracoE',
        label: 'Braço Esquerdo',
        cx: 75,
        cy: 110
    },
    {
        id: 'bracoD',
        label: 'Braço Direito',
        cx: 145,
        cy: 110
    },
    {
        id: 'cotoveloE',
        label: 'Cotovelo Esquerdo',
        cx: 75,
        cy: 135
    },
    {
        id: 'cotoveloD',
        label: 'Cotovelo Direito',
        cx: 145,
        cy: 135
    },
    {
        id: 'antebracoE',
        label: 'Antebraço Esquerdo',
        cx: 75,
        cy: 160
    },
    {
        id: 'antebracoD',
        label: 'Antebraço Direito',
        cx: 145,
        cy: 160
    },
    {
        id: 'maoE',
        label: 'Mão Esquerda',
        cx: 75,
        cy: 185
    },
    {
        id: 'maoD',
        label: 'Mão Direita',
        cx: 145,
        cy: 185
    },
    {
        id: 'troncoCervical',
        label: 'Tronco - Cervical',
        cx: 110,
        cy: 80
    },
    {
        id: 'troncoTorax',
        label: 'Tronco - Tórax',
        cx: 110,
        cy: 110
    },
    {
        id: 'troncoLombar',
        label: 'Tronco - Lombar',
        cx: 110,
        cy: 140
    },
    {
        id: 'quadril',
        label: 'Quadril',
        cx: 110,
        cy: 160
    },
    {
        id: 'coxaE',
        label: 'Coxa Esquerda',
        cx: 95,
        cy: 170
    },
    {
        id: 'coxaD',
        label: 'Coxa Direita',
        cx: 125,
        cy: 170
    },
    {
        id: 'fossaPopliteaE',
        label: 'Fossa Poplítea Esquerda',
        cx: 95,
        cy: 200
    },
    {
        id: 'fossaPopliteaD',
        label: 'Fossa Poplítea Direita',
        cx: 125,
        cy: 200
    },
    {
        id: 'panturrilhaE',
        label: 'Panturrilha Esquerda',
        cx: 95,
        cy: 230
    },
    {
        id: 'panturrilhaD',
        label: 'Panturrilha Direita',
        cx: 125,
        cy: 230
    },
    {
        id: 'peE',
        label: 'Pé Esquerdo',
        cx: 95,
        cy: 260
    },
    {
        id: 'peD',
        label: 'Pé Direito',
        cx: 125,
        cy: 260
    }
];
const CorpoHumanoInterativo = ({ value = [], onChange })=>{
    _s();
    const [selecionadasAnterior, setSelecionadasAnterior] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selecionadasPosterior, setSelecionadasPosterior] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggleRegiaoAnterior = (id)=>{
        let novas;
        if (selecionadasAnterior.includes(id)) {
            novas = selecionadasAnterior.filter((r)=>r !== id);
        } else {
            novas = [
                ...selecionadasAnterior,
                id
            ];
        }
        setSelecionadasAnterior(novas);
        if (onChange) onChange({
            anterior: novas,
            posterior: selecionadasPosterior
        });
    };
    const toggleRegiaoPosterior = (id)=>{
        let novas;
        if (selecionadasPosterior.includes(id)) {
            novas = selecionadasPosterior.filter((r)=>r !== id);
        } else {
            novas = [
                ...selecionadasPosterior,
                id
            ];
        }
        setSelecionadasPosterior(novas);
        if (onChange) onChange({
            anterior: selecionadasAnterior,
            posterior: novas
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-row items-center justify-center gap-8 my-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 220 320",
                width: 160,
                height: 320,
                style: {
                    background: 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M90,30 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
                        fill: selecionadasAnterior.includes('cabeca') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('cabeca') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('cabeca')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 93,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "100",
                        y: "50",
                        width: "20",
                        height: "20",
                        rx: "6",
                        fill: selecionadasAnterior.includes('pescoco') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('pescoco') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('pescoco')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 95,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "85",
                        cy: "70",
                        rx: "15",
                        ry: "10",
                        fill: selecionadasAnterior.includes('ombroE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('ombroE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('ombroE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 97,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "135",
                        cy: "70",
                        rx: "15",
                        ry: "10",
                        fill: selecionadasAnterior.includes('ombroD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('ombroD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('ombroD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "90",
                        y: "80",
                        width: "40",
                        height: "40",
                        rx: "16",
                        fill: selecionadasAnterior.includes('torax') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('torax') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('torax')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 101,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "120",
                        width: "30",
                        height: "25",
                        rx: "12",
                        fill: selecionadasAnterior.includes('quadril') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('quadril') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('quadril')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 103,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "65",
                        y: "80",
                        width: "20",
                        height: "60",
                        rx: "10",
                        fill: selecionadasAnterior.includes('bracoE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('bracoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('bracoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 105,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "135",
                        y: "80",
                        width: "20",
                        height: "60",
                        rx: "10",
                        fill: selecionadasAnterior.includes('bracoD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('bracoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('bracoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 107,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "75",
                        cy: "140",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasAnterior.includes('cotoveloE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('cotoveloE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('cotoveloE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 109,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "145",
                        cy: "140",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasAnterior.includes('cotoveloD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('cotoveloD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('cotoveloD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 111,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "65",
                        y: "147",
                        width: "15",
                        height: "35",
                        rx: "7",
                        fill: selecionadasAnterior.includes('antebracoE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('antebracoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('antebracoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 113,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "140",
                        y: "147",
                        width: "15",
                        height: "35",
                        rx: "7",
                        fill: selecionadasAnterior.includes('antebracoD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('antebracoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('antebracoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 115,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "72",
                        cy: "185",
                        rx: "10",
                        ry: "12",
                        fill: selecionadasAnterior.includes('maoE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('maoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('maoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 117,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "148",
                        cy: "185",
                        rx: "10",
                        ry: "12",
                        fill: selecionadasAnterior.includes('maoD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('maoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('maoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 119,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "145",
                        width: "15",
                        height: "45",
                        rx: "8",
                        fill: selecionadasAnterior.includes('coxaE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('coxaE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('coxaE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 121,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "120",
                        y: "145",
                        width: "15",
                        height: "45",
                        rx: "8",
                        fill: selecionadasAnterior.includes('coxaD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('coxaD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('coxaD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "102",
                        cy: "195",
                        rx: "8",
                        ry: "10",
                        fill: selecionadasAnterior.includes('joelhoE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('joelhoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('joelhoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 125,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "128",
                        cy: "195",
                        rx: "8",
                        ry: "10",
                        fill: selecionadasAnterior.includes('joelhoD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('joelhoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('joelhoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 127,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "97",
                        y: "205",
                        width: "10",
                        height: "35",
                        rx: "5",
                        fill: selecionadasAnterior.includes('panturrilhaE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('panturrilhaE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('panturrilhaE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 129,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "123",
                        y: "205",
                        width: "10",
                        height: "35",
                        rx: "5",
                        fill: selecionadasAnterior.includes('panturrilhaD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('panturrilhaD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('panturrilhaD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 131,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "102",
                        cy: "250",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasAnterior.includes('peE') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('peE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('peE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 133,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "128",
                        cy: "250",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasAnterior.includes('peD') ? '#1976d2' : '#e0e7ef',
                        opacity: selecionadasAnterior.includes('peD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoAnterior('peD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 135,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                lineNumber: 91,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 220 320",
                width: 160,
                height: 320,
                style: {
                    background: 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M90,30 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
                        fill: selecionadasPosterior.includes('cabeca') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('cabeca') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('cabeca')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 141,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "100",
                        y: "50",
                        width: "20",
                        height: "20",
                        rx: "6",
                        fill: selecionadasPosterior.includes('cervical') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('cervical') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('cervical')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 143,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "85",
                        cy: "70",
                        rx: "15",
                        ry: "10",
                        fill: selecionadasPosterior.includes('ombroE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('ombroE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('ombroE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "135",
                        cy: "70",
                        rx: "15",
                        ry: "10",
                        fill: selecionadasPosterior.includes('ombroD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('ombroD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('ombroD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 147,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "100",
                        y: "80",
                        width: "20",
                        height: "20",
                        rx: "8",
                        fill: selecionadasPosterior.includes('troncoCervical') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('troncoCervical') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('troncoCervical')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 149,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "100",
                        width: "30",
                        height: "30",
                        rx: "10",
                        fill: selecionadasPosterior.includes('troncoTorax') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('troncoTorax') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('troncoTorax')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 151,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "130",
                        width: "30",
                        height: "25",
                        rx: "10",
                        fill: selecionadasPosterior.includes('troncoLombar') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('troncoLombar') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('troncoLombar')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "155",
                        width: "30",
                        height: "20",
                        rx: "10",
                        fill: selecionadasPosterior.includes('quadril') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('quadril') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('quadril')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 155,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "65",
                        y: "80",
                        width: "20",
                        height: "60",
                        rx: "10",
                        fill: selecionadasPosterior.includes('bracoE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('bracoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('bracoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 157,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "135",
                        y: "80",
                        width: "20",
                        height: "60",
                        rx: "10",
                        fill: selecionadasPosterior.includes('bracoD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('bracoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('bracoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 159,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "75",
                        cy: "140",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasPosterior.includes('cotoveloE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('cotoveloE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('cotoveloE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 161,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "145",
                        cy: "140",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasPosterior.includes('cotoveloD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('cotoveloD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('cotoveloD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 163,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "65",
                        y: "147",
                        width: "15",
                        height: "35",
                        rx: "7",
                        fill: selecionadasPosterior.includes('antebracoE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('antebracoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('antebracoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "140",
                        y: "147",
                        width: "15",
                        height: "35",
                        rx: "7",
                        fill: selecionadasPosterior.includes('antebracoD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('antebracoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('antebracoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 167,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "72",
                        cy: "185",
                        rx: "10",
                        ry: "12",
                        fill: selecionadasPosterior.includes('maoE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('maoE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('maoE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "148",
                        cy: "185",
                        rx: "10",
                        ry: "12",
                        fill: selecionadasPosterior.includes('maoD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('maoD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('maoD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 171,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "95",
                        y: "175",
                        width: "15",
                        height: "35",
                        rx: "8",
                        fill: selecionadasPosterior.includes('coxaE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('coxaE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('coxaE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "120",
                        y: "175",
                        width: "15",
                        height: "35",
                        rx: "8",
                        fill: selecionadasPosterior.includes('coxaD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('coxaD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('coxaD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 175,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "102",
                        cy: "215",
                        rx: "8",
                        ry: "10",
                        fill: selecionadasPosterior.includes('fossaPopliteaE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('fossaPopliteaE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('fossaPopliteaE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "128",
                        cy: "215",
                        rx: "8",
                        ry: "10",
                        fill: selecionadasPosterior.includes('fossaPopliteaD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('fossaPopliteaD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('fossaPopliteaD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 179,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "97",
                        y: "225",
                        width: "10",
                        height: "35",
                        rx: "5",
                        fill: selecionadasPosterior.includes('panturrilhaE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('panturrilhaE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('panturrilhaE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 181,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: "123",
                        y: "225",
                        width: "10",
                        height: "35",
                        rx: "5",
                        fill: selecionadasPosterior.includes('panturrilhaD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('panturrilhaD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('panturrilhaD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 183,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "102",
                        cy: "270",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasPosterior.includes('peE') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('peE') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('peE')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 185,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "128",
                        cy: "270",
                        rx: "10",
                        ry: "7",
                        fill: selecionadasPosterior.includes('peD') ? '#e91e63' : '#e0e7ef',
                        opacity: selecionadasPosterior.includes('peD') ? 0.7 : 0.35,
                        stroke: "#0d223a",
                        strokeWidth: "3.5",
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>toggleRegiaoPosterior('peD')
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                        lineNumber: 187,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
                lineNumber: 138,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js",
        lineNumber: 89,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CorpoHumanoInterativo, "XZRoOANGl9G+Mvha3cN5KEBtl+8=");
_c = CorpoHumanoInterativo;
const __TURBOPACK__default__export__ = CorpoHumanoInterativo;
var _c;
__turbopack_context__.k.register(_c, "CorpoHumanoInterativo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$CorpoHumanoInterativo$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/components/CorpoHumanoInterativo.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/lucide-react/dist/esm/icons/upload.js [client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Frown$3e$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/lucide-react/dist/esm/icons/frown.js [client] (ecmascript) <export default as Frown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/lucide-react/dist/esm/icons/smile.js [client] (ecmascript) <export default as Smile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [client] (ecmascript) <export default as CheckCircle>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const CardAvaliacaoInicial = ({ onComplete })=>{
    _s();
    const [exames, setExames] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [temDor, setTemDor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // 'sim' ou 'nao'
    const [examePreview, setExamePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [erro, setErro] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [enviado, setEnviado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [regioesDor, setRegioesDor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [dragActive, setDragActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleExameChange = (e)=>{
        const files = Array.from(e.target.files);
        setExames(files);
        setExamePreview(files.map((file)=>URL.createObjectURL(file)));
    };
    const handleDrop = (e)=>{
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files);
        setExames(files);
        setExamePreview(files.map((file)=>URL.createObjectURL(file)));
    };
    const handleDragOver = (e)=>{
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = (e)=>{
        e.preventDefault();
        setDragActive(false);
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (temDor === null) {
            setErro('Por favor, responda se você sente dor.');
            return;
        }
        if (exames.length === 0) {
            setErro('Por favor, faça upload de pelo menos um exame ou documento.');
            return;
        }
        if (temDor && regioesDor.length === 0) {
            setErro('Por favor, marque no corpo onde sente dor.');
            return;
        }
        setErro('');
        setEnviado(true);
        if (onComplete) onComplete();
    };
    if (enviado) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-[300px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg shadow-md bg-green-50 p-6 text-center max-w-md w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-2",
                        children: "Avaliação enviada!"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                        lineNumber: 64,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-green-700",
                        children: "Obrigado por completar sua avaliação inicial."
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                lineNumber: 63,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
            lineNumber: 62,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex items-center justify-center p-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-gray-800",
                            children: "Avaliação Inicial"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 76,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-sm mt-2",
                            children: "Vamos checar como você está hoje."
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 75,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 p-8 text-center cursor-pointer hover:bg-blue-100 transition-colors relative ${dragActive ? 'border-blue-400 bg-blue-100' : ''}`,
                    onClick: ()=>fileInputRef.current && fileInputRef.current.click(),
                    onDrop: handleDrop,
                    onDragOver: handleDragOver,
                    onDragLeave: handleDragLeave,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: fileInputRef,
                            type: "file",
                            accept: "image/*,application/pdf",
                            multiple: true,
                            onChange: handleExameChange,
                            className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 88,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center space-y-2",
                            children: exames.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "w-10 h-10 text-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-green-700",
                                        children: [
                                            exames[0].name,
                                            exames.length > 1 ? ` +${exames.length - 1} arquivo(s)` : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                        lineNumber: 100,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        className: "w-10 h-10 text-blue-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                        lineNumber: 104,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-blue-700",
                                        children: "Clique ou arraste seus exames"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-blue-400",
                                        children: "PDF, JPG ou PNG"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 96,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 81,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 mb-3 text-center",
                            children: "Você está sentindo dor hoje?"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 114,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setTemDor('sim'),
                                    className: `p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all w-full
                ${temDor === 'sim' ? 'border-red-500 bg-red-50 text-red-600 scale-105' : 'border-gray-200 hover:border-red-200 hover:bg-gray-50 text-gray-600'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$frown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Frown$3e$__["Frown"], {
                                            className: `w-8 h-8 ${temDor === 'sim' ? 'fill-current' : ''}`
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                            lineNumber: 125,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: "Sim, sinto"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setTemDor('nao'),
                                    className: `p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all w-full
                ${temDor === 'nao' ? 'border-green-500 bg-green-50 text-green-600 scale-105' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smile$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smile$3e$__["Smile"], {
                                            className: `w-8 h-8 ${temDor === 'nao' ? 'fill-current' : ''}`
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: "Não, estou bem"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                            lineNumber: 117,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 113,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                temDor === 'sim' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full mt-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$CorpoHumanoInterativo$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        value: regioesDor,
                        onChange: setRegioesDor
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                        lineNumber: 145,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 144,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                temDor === 'nao' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-600 text-center mt-4",
                    children: "Ótimo! Caso sinta dor futuramente, vamos tratar juntos."
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 149,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                erro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-600 mb-4 text-center",
                    children: erro
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 152,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 mt-2 text-xl",
                    children: "Enviar Avaliação"
                }, void 0, false, {
                    fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
                    lineNumber: 155,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
            lineNumber: 73,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CardAvaliacaoInicial, "geJ13HcT9eNKq2Io+BWOQvs8+yE=");
_c = CardAvaliacaoInicial;
const __TURBOPACK__default__export__ = CardAvaliacaoInicial;
var _c;
__turbopack_context__.k.register(_c, "CardAvaliacaoInicial");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/components/SidebarMenu.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
;
;
;
const menuItems = [
    {
        label: 'Início',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaHome"], {}, void 0, false, {
            fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
            lineNumber: 5,
            columnNumber: 28
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/dashboard-paciente'
    },
    {
        label: 'Avaliação',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaClipboardList"], {}, void 0, false, {
            fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
            lineNumber: 6,
            columnNumber: 31
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/avaliacao'
    },
    {
        label: 'Agendamentos',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {}, void 0, false, {
            fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
            lineNumber: 7,
            columnNumber: 34
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/agendamentos'
    },
    {
        label: 'Perfil',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUser"], {}, void 0, false, {
            fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
            lineNumber: 8,
            columnNumber: 28
        }, ("TURBOPACK compile-time value", void 0)),
        href: '/perfil'
    }
];
const SidebarMenu = ({ onLogout })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "fixed left-0 top-0 h-full w-20 bg-white shadow-lg flex flex-col items-center py-6 z-30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8"
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                lineNumber: 14,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 flex flex-col gap-8",
                children: menuItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: item.href,
                        className: "flex flex-col items-center text-gray-600 hover:text-blue-600 transition",
                        title: item.label,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl mb-1",
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                                lineNumber: 23,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium",
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                                lineNumber: 24,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, idx, true, {
                        fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                        lineNumber: 17,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onLogout,
                className: "mt-8 flex flex-col items-center text-gray-400 hover:text-red-500 transition",
                title: "Sair",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaSignOutAlt"], {
                        className: "text-2xl mb-1"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                        lineNumber: 33,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium",
                        children: "Sair"
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                        lineNumber: 34,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/MoveOn/components/SidebarMenu.js",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SidebarMenu;
const __TURBOPACK__default__export__ = SidebarMenu;
var _c;
__turbopack_context__.k.register(_c, "SidebarMenu");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/services/supabaseClient.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/@supabase/supabase-js/dist/module/index.js [client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mfkhalztizbyesllpjsy.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ma2hhbHp0aXpieWVzbGxwanN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTcxMjEsImV4cCI6MjA3ODk5MzEyMX0.aC8OaTViq1u3cF4q4BQ-gyM6LwWkLnzuiAzvDNu4f5U");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/MoveOn/pages/dashboard-paciente.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPaciente
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$DashboardHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/components/DashboardHeader.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$CardBoasVindas$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/components/CardBoasVindas.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$CardAvaliacaoInicial$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/components/CardAvaliacaoInicial.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$SidebarMenu$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/components/SidebarMenu.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$services$2f$supabaseClient$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/services/supabaseClient.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function DashboardPaciente() {
    _s();
    const [nome, setNome] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const proximoAgendamento = '29/11/2025, 14:00 - Dr. Marcos (Online)';
    const progresso = '60% do Plano Concluído';
    const [avaliacaoCompleta, setAvaliacaoCompleta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPaciente.useEffect": ()=>{
            async function fetchUser() {
                const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$services$2f$supabaseClient$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                if (user) {
                    setNome(user.user_metadata?.full_name || user.user_metadata?.name || user.email || 'Usuário');
                }
            }
            fetchUser();
        }
    }["DashboardPaciente.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$SidebarMenu$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                onLogout: ()=>alert('Logout')
            }, void 0, false, {
                fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 ml-20 max-w-3xl mx-auto px-4 pb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$DashboardHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        nome: nome
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$components$2f$CardBoasVindas$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        nome: nome,
                        proximoAgendamento: proximoAgendamento,
                        progresso: progresso
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 flex flex-col items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/avaliacao-inicial",
                            className: "bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition text-lg font-semibold",
                            children: "Avaliação Inicial"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                            lineNumber: 33,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/MoveOn/pages/dashboard-paciente.js",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(DashboardPaciente, "BtABo70+HaAjtxgfZDFq74gxilw=");
_c = DashboardPaciente;
var _c;
__turbopack_context__.k.register(_c, "DashboardPaciente");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/Documents/MoveOn/pages/dashboard-paciente.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/dashboard-paciente";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/Documents/MoveOn/pages/dashboard-paciente.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/Documents/MoveOn/pages/dashboard-paciente\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/Documents/MoveOn/pages/dashboard-paciente.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__5f871914._.js.map