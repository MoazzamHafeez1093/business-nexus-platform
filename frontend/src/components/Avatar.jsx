export default function Avatar({ src, alt, name, size = 48 }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : '?';
  return src ? (
    <img src={src} alt={alt || name} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold" style={{ width: size, height: size, fontSize: size/2 }}>
      {initials}
    </div>
  );
} 