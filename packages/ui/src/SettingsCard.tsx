import type { ReactNode } from 'react';
import './SettingsCard.css';

interface SettingsCardProps {
  icon: ReactNode;
  title: string;
  description?: string;
  variant?: 'default' | 'danger';
  children?: ReactNode;
  action?: ReactNode;
}

export function SettingsCard({ icon, title, description, variant = 'default', children, action }: SettingsCardProps) {
  return (
    <div className={`rui-settings-card rui-settings-card--${variant}`}>
      <div className="rui-settings-card-header">
        <div className={`rui-settings-card-icon rui-settings-card-icon--${variant}`}>
          {icon}
        </div>
        <div className="rui-settings-card-meta">
          <div className={`rui-settings-card-title rui-settings-card-title--${variant}`}>{title}</div>
          {description ? <div className="rui-settings-card-desc">{description}</div> : null}
        </div>
        {action ? <div className="rui-settings-card-action">{action}</div> : null}
      </div>
      {children ? <div className="rui-settings-card-body">{children}</div> : null}
    </div>
  );
}
