# **App Name**: Pixel Creative Approvals

## Core Features:

- Multi-tenant Client Management: Administración de clientes con aislamiento por clientId y slug. Reglas de Firestore/Storage multi-tenant: solo acceso a documentos con clientId ∈ auth.token.customClaims.clientIds. Define roles admin|designer|client|viewer con permisos explícitos.
- Campaign & Creative Workflow: Flujo de creación, revisión y aprobación de campañas y creativos.
- Format Validation Tool: Validación de assets (imágenes/videos) según especificaciones (dimensiones, peso, ratio). Crea colección formatSpecs con: Meta/IG: Feed 1:1 (1440×1440; min ancho 600), Feed 4:5 (1440×1800), Stories/Reels 9:16 (1080×1920+), Carrusel 1:1 (≥1080×1080). Google Ads: 1.91:1 1200×628 (min 600×314), 1:1 1200×1200 (min 300×300), 4:5 960×1200 (min 480×600), Logos 1:1 1200×1200 (min 128×128) y 4:1 1200×300 (min 512×128), banners 300×250, 336×280, 728×90, 160×600, 300×600, 970×250 (≤150 KB estático). TikTok: In-Feed 9:16 1080×1920; Thumbnail 1:1 1080×1080.
- AI-Powered Suggestion and Validation: Herramienta de AI para sugerir cropping/resizing óptimo y validaciones inteligentes usando Gemini via Genkit. Es una herramienta. Uploader: Valida ratio, dimensiones y peso; sugiere recortes con Gemini/Genkit; procesa imágenes con sharp y video thumbnails con FFmpeg en Functions. Tipos permitidos (JPG/PNG/WebP y MP4/H.264), peso máximo (ej. 30 MB imagen, 200 MB video) y dimensiones máximas (p. ej. 4096 px lado mayor) con auto-resize vía sharp/FFmpeg.
- Real-time Commenting & Approval System: Sistema de comentarios y aprobaciones granulares (copy, imagen, final). Estados claros: draft → review → approved/changes. Scopes de aprobación: copy, image, final (por variación).
- Secure Invitation & Magic Link Authentication: Invitación segura a clientes vía email con magic links. Expiración configurable (p. ej. 48 h), single-use, y revoque si cambia el rol o el tenant. Email vía extensión (SendGrid/Mailjet) + plantillas.
- Role-Based Access Control: Control de acceso basado en roles (admin, designer, client, viewer).
- Hosting and Domains: Publicación en approvals.pixelcreativeagency.com (subdominio) y creación de Preview Channels (URLs temporales) para “ver en vivo”. Configura Firebase Hosting Preview Channels automáticos en cada push para testear en vivo. CORS/headers seguros (no‐sniff, frame-ancestors, etc.) via firebase.json.
- Audit Logs and Export: Crea activityLogs y función zipExport(campaignId) con manifest.json.
- Performance and Accessibility: Índices compuestos para: campaigns (clientId, status), creatives (campaignId, status), variations (creativeId, status). Lighthouse ≥90 objetivo en detalle de creativo.
- Notifications: onCommentCreated y onApprovalChanged (Functions) con emails y (a futuro) webhook Slack/WhatsApp.
- Internationalization (i18n): Páginas i18n ES/EN (aunque sea básico): ES por defecto.
- Branding: Branding: footer con logo e info de Pixel; per-tenant logo del cliente.
- App Check: Enable Firebase App Check (reCaptcha Enterprise / Token web) en web, Emulators y Hosting Preview.
- Seed Data: Crear seed con 1 admin (agencia), 1 client, 1 campaña, 1 creativo y 3 variaciones (1:1, 4:5, 9:16) para test end-to-end.

## Style Guidelines:

- Color primario: Azul desaturado (#A7C7E7) estilo Meta.
- Color de fondo: Gris claro (#F0F2F5).
- Color de acento: Azul suave (#64B5F6) para elementos interactivos.
- Tipografía para headings: 'Poppins', sans-serif.
- Tipografía para body: 'PT Sans', sans-serif.
- Lucide icons para consistencia visual.
- Sidebar + layout en cards, spacing generoso, previews optimizados.
- Transiciones sutiles y feedback animations.