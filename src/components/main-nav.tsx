import React from 'react';

interface NavLink {
  label: string;
  href: string;
}

interface MainNavProps {
  userName?: string;
  userAvatar?: string | null;
}

const MainNav: React.FC<MainNavProps> = ({ 
  userName = "Sabrina", 
  userAvatar = null 
}) => {
  const navLinks: NavLink[] = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Mis Cursos', href: '/my-courses' },
    { label: 'Cursos', href: '/courses' },
    { label: 'Recursos', href: '/resources' },
    { label: 'Comunidad', href: '/community' }
  ];

  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Logo placeholder - se agregará después */}
        <div className="nav-logo">
          {/* Logo aquí */}
        </div>

        {/* Navigation links */}
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* User profile */}
        <div className="nav-user">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="user-avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="user-name">{userName}</span>
        </div>
      </div>

      <style>
        {`
        .main-nav {
          background-color: #f5f5f5;
          border-bottom: 1px solid #e0e0e0;
          padding: 0 2rem;
        }

        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          height: 70px;
        }

        .nav-logo {
          flex-shrink: 0;
          width: 120px;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #7c3aed;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        .user-avatar,
        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .nav-link {
            font-size: 13px;
          }

          .user-name {
            display: none;
          }
        }
        `}
      </style>
    </nav>
  );
};

export default MainNav;