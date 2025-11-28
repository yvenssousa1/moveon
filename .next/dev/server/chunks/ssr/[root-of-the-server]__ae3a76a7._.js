module.exports = [
"[project]/Documents/MoveOn/services/supabaseClient.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
(()=>{
    const e = new Error("Cannot find module '@supabase/supabase-js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mfkhalztizbyesllpjsy.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ma2hhbHp0aXpieWVzbGxwanN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTcxMjEsImV4cCI6MjA3ODk5MzEyMX0.aC8OaTViq1u3cF4q4BQ-gyM6LwWkLnzuiAzvDNu4f5U");
const supabase = createClient(supabaseUrl, supabaseAnonKey);
}),
"[project]/Documents/MoveOn/pages/login.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$services$2f$supabaseClient$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/MoveOn/services/supabaseClient.js [ssr] (ecmascript)");
;
;
;
;
function Login() {
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Preencha todos os campos.');
            return;
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$MoveOn$2f$services$2f$supabaseClient$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email,
            password
        });
        if (error) setError(error.message);
        else window.location.href = '/dashboard-paciente';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1976d2 0%, #43e97b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: 32,
                minWidth: 340,
                maxWidth: 380,
                width: '100%'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        marginBottom: 24
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "/icons/icon-192x192.png",
                            alt: "Logo",
                            style: {
                                width: 48,
                                height: 48,
                                marginBottom: 8
                            }
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            style: {
                                margin: 0,
                                color: '#1976d2',
                                fontWeight: 700
                            },
                            children: "MoveOn Scheduler"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "email",
                            placeholder: "E-mail",
                            value: email,
                            onChange: (e)=>setEmail(e.target.value),
                            style: {
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid #ccc',
                                fontSize: 16
                            },
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'relative'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: showPassword ? 'text' : 'password',
                                    placeholder: "Senha",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    style: {
                                        padding: 12,
                                        borderRadius: 8,
                                        border: '1px solid #ccc',
                                        fontSize: 16,
                                        width: '100%'
                                    },
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    onClick: ()=>setShowPassword((s)=>!s),
                                    style: {
                                        position: 'absolute',
                                        right: 12,
                                        top: 12,
                                        cursor: 'pointer',
                                        color: '#1976d2',
                                        fontSize: 18
                                    },
                                    title: "Mostrar/ocultar senha",
                                    children: showPassword ? '🙈' : '👁️'
                                }, void 0, false, {
                                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            style: {
                                background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: 12,
                                fontWeight: 700,
                                fontSize: 16,
                                cursor: 'pointer'
                            },
                            children: "Entrar"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            style: {
                                color: 'red',
                                fontSize: 14
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 55,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        marginTop: 16,
                        fontSize: 14
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/recuperar-senha",
                            style: {
                                color: '#1976d2',
                                textDecoration: 'underline',
                                textAlign: 'center'
                            },
                            children: "Esqueci minha Senha"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/cadastro",
                            style: {
                                background: 'linear-gradient(90deg, #1976d2 60%, #43e97b 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '10px 0',
                                fontWeight: 700,
                                fontSize: 16,
                                textAlign: 'center',
                                textDecoration: 'none',
                                marginTop: 8,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(25,118,210,0.08)'
                            },
                            children: "Criar uma nova conta"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        borderTop: '1px solid #eee',
                        marginTop: 24,
                        paddingTop: 16,
                        textAlign: 'center',
                        fontSize: 13
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/trabalhe-conosco",
                            style: {
                                color: '#1976d2',
                                marginRight: 12
                            },
                            children: "Trabalhe Conosco"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "/termos",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            style: {
                                color: '#1976d2',
                                marginRight: 12
                            },
                            children: "Termos"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "/privacidade",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            style: {
                                color: '#1976d2'
                            },
                            children: "Privacidade"
                        }, void 0, false, {
                            fileName: "[project]/Documents/MoveOn/pages/login.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Documents/MoveOn/pages/login.js",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Documents/MoveOn/pages/login.js",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documents/MoveOn/pages/login.js",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ae3a76a7._.js.map