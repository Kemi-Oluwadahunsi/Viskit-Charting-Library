import type { TooltipPayload } from '@viskit/core';

export type TooltipVariant = 'default' | 'minimal' | 'compact' | 'gradient' | 'outline';

export interface TooltipContentProps {
  /** Payload items to display */
  items: TooltipPayload[];
  /** Category label (e.g., "January") */
  label?: string;
  /** Visual variant (default: 'default') */
  variant?: TooltipVariant;
  /** Background color override */
  background?: string;
  /** Border color override */
  borderColor?: string;
}

const FONT: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  pointerEvents: 'none',
};

function DefaultVariant({ items, label, background, borderColor }: TooltipContentProps) {
  return (
    <div
      style={{
        ...FONT,
        background: background ?? 'rgba(15, 23, 42, 0.92)',
        border: `1px solid ${borderColor ?? 'rgba(255,255,255,0.1)'}`,
        borderRadius: 8,
        padding: '8px 12px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        fontSize: 12,
        color: '#E2E8F0',
        minWidth: 120,
      }}
    >
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>
          {label}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          <span style={{ color: '#94A3B8', flex: 1 }}>{item.label}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{item.formattedValue}</span>
        </div>
      ))}
    </div>
  );
}

function MinimalVariant({ items, label }: TooltipContentProps) {
  const primary = items[0];
  if (!primary) return null;
  return (
    <div
      style={{
        ...FONT,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 20,
        padding: '5px 12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
        fontSize: 12,
        color: '#E2E8F0',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: primary.color }} />
      {label && <span style={{ color: '#94A3B8', fontSize: 11 }}>{label}</span>}
      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{primary.formattedValue}</span>
      {items.length > 1 && (
        <span style={{ color: '#64748B', fontSize: 10 }}>+{items.length - 1}</span>
      )}
    </div>
  );
}

function CompactVariant({ items, label }: TooltipContentProps) {
  return (
    <div
      style={{
        ...FONT,
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 6,
        padding: '4px 8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        fontSize: 11,
        color: '#E2E8F0',
        minWidth: 80,
      }}
    >
      {label && (
        <div style={{ fontSize: 10, color: '#64748B', marginBottom: 2, fontWeight: 500 }}>{label}</div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '1px 0' }}>
          <span style={{ width: 6, height: 6, borderRadius: 1, background: item.color, flexShrink: 0 }} />
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{item.formattedValue}</span>
        </div>
      ))}
    </div>
  );
}

function GradientVariant({ items, label }: TooltipContentProps) {
  const accent = items[0]?.color ?? '#818CF8';
  return (
    <div
      style={{
        ...FONT,
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: `0 0 24px ${accent}33, 0 8px 32px rgba(0,0,0,0.5)`,
        fontSize: 12,
        color: '#E2E8F0',
        minWidth: 130,
        borderTop: `2px solid ${accent}`,
      }}
    >
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, marginBottom: 6, letterSpacing: 0.3 }}>
          {label}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${item.color}, ${item.color}88)`,
              boxShadow: `0 0 6px ${item.color}66`,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#94A3B8', flex: 1, fontSize: 11 }}>{item.label}</span>
          <span style={{ fontWeight: 700, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
            {item.formattedValue}
          </span>
        </div>
      ))}
    </div>
  );
}

function OutlineVariant({ items, label }: TooltipContentProps) {
  return (
    <div
      style={{
        ...FONT,
        background: 'rgba(248, 250, 252, 0.95)',
        border: '1px solid #E2E8F0',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: 12,
        color: '#1E293B',
        minWidth: 120,
      }}
    >
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4 }}>
          {label}
        </div>
      )}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: `2px solid ${item.color}`,
              background: 'transparent',
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#64748B', flex: 1 }}>{item.label}</span>
          <span style={{ fontWeight: 700, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
            {item.formattedValue}
          </span>
        </div>
      ))}
    </div>
  );
}

const VARIANTS: Record<TooltipVariant, React.FC<TooltipContentProps>> = {
  default: DefaultVariant,
  minimal: MinimalVariant,
  compact: CompactVariant,
  gradient: GradientVariant,
  outline: OutlineVariant,
};

export function TooltipContent(props: TooltipContentProps) {
  const { items, variant = 'default' } = props;
  if (!items || items.length === 0) return null;
  const Renderer = VARIANTS[variant];
  return <Renderer {...props} />;
}
