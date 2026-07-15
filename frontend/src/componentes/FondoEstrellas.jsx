

export default function FondoEstrellas({ lado = 'dioses' }) {
    const colorParticula = lado === 'titanes' ? '#FF4444' : '#FFD700';

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{
                    width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                    backgroundColor: colorParticula,
                    animation: `estrella ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
                }} className="absolute rounded-full opacity-0" />
            ))}
        </div>
    );
}
