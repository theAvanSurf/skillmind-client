"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const guestLinks = [
	{ href: "/", label: "Inicio" },
	{ href: "/courses", label: "Cursos" },
	{ href: "/pricing", label: "Planes" },
	{ href: "/about", label: "Sobre nosotros" },
];

export default function Layout({ children }: Props) {
	const pathname = usePathname();

	
const hideNav =
  pathname === "/login" || pathname.startsWith("/register");



	return (
		<div className="guest-shell">
			{!hideNav && (
				<header className="guest-header">
					<div className="guest-nav">
						<Link href="/" className="brand">Skillmind</Link>

						<nav className="links">
							{guestLinks.map((item) => (
								<Link key={item.href} href={item.href} className="link">
									{item.label}
								</Link>
							))}
						</nav>

						<div className="actions">
							<Link href="/login" className="ghost">Iniciar sesion</Link>
							<Link href="/signup" className="primary">Crear cuenta</Link>
						</div>
					</div>
				</header>
			)}

			<main className="guest-content">{children}</main>

			<style jsx>{`
				.guest-shell {
					min-height: 100vh;
					background: radial-gradient(circle at 10% 10%, #eef2ff 0, transparent 28%),
						radial-gradient(circle at 90% 15%, #cffafe 0, transparent 22%),
						#f8fafc;
					color: #0f172a;
				}

				.guest-header {
					position: sticky;
					top: 0;
					z-index: 5;
					backdrop-filter: blur(8px);
					background: rgba(255, 255, 255, 0.82);
					border-bottom: 1px solid #e2e8f0;
				}

				.guest-nav {
					display: grid;
					grid-template-columns: auto 1fr auto;
					align-items: center;
					gap: 1rem;
					max-width: 1200px;
					margin: 0 auto;
					padding: 0.9rem 1.25rem;
				}

				.brand {
					font-weight: 700;
					font-size: 18px;
					letter-spacing: -0.01em;
					color: #0f172a;
					text-decoration: none;
				}

				.links {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 1rem;
					flex-wrap: wrap;
				}

				.link {
					color: #475569;
					font-weight: 500;
					font-size: 14px;
					text-decoration: none;
					padding: 0.45rem 0.7rem;
					border-radius: 10px;
					transition: background 0.2s ease, color 0.2s ease;
				}

				.link:hover {
					color: #0f172a;
					background: #e2e8f0;
				}

				.actions {
					display: flex;
					align-items: center;
					gap: 0.65rem;
				}

				.ghost {
					padding: 0.5rem 0.85rem;
					border-radius: 10px;
					text-decoration: none;
					font-weight: 600;
					color: #0f172a;
					border: 1px solid #e2e8f0;
					background: #ffffff;
					transition: border 0.2s ease, box-shadow 0.2s ease;
				}

				.ghost:hover {
					border-color: #0ea5e9;
					box-shadow: 0 8px 20px rgba(14, 165, 233, 0.12);
				}

				.primary {
					padding: 0.55rem 1rem;
					border-radius: 12px;
					text-decoration: none;
					font-weight: 700;
					color: #ffffff;
					background: linear-gradient(135deg, #0ea5e9, #6366f1);
					box-shadow: 0 10px 30px rgba(99, 102, 241, 0.25);
					transition: transform 0.15s ease, box-shadow 0.15s ease;
				}

				.primary:hover {
					transform: translateY(-1px);
					box-shadow: 0 14px 34px rgba(99, 102, 241, 0.3);
				}

				.guest-content {
					max-width: 1200px;
					margin: 0 auto;
					padding: 2.25rem 1.25rem 3rem;
				}

				@media (max-width: 900px) {
					.guest-nav {
						grid-template-columns: 1fr;
						grid-template-areas:
							"brand actions"
							"links links";
					}

					.links {
						justify-content: flex-start;
					}

					.actions {
						justify-content: flex-end;
					}
				}

				@media (max-width: 640px) {
					.guest-header {
						position: static;
					}

					.guest-nav {
						gap: 0.75rem;
						padding: 0.75rem 1rem;
					}

					.guest-content {
						padding: 1.75rem 1rem 2.5rem;
					}
				}
			`}</style>
		</div>
	);
}
