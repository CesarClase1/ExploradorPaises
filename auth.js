// Importa la librería Supabase desde CDN (solo funciona si usas un entorno moderno con módulos ES)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

(async function () {
    // A. Animación de "shake"
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // B. Inicializar Supabase con tus credenciales reales
    const supabaseUrl = 'https://cwcamrecylqqmvhfuxjr.supabase.co'; // ⬅️ Reemplaza esto
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3Y2FtcmVjeWxxcW12aGZ1eGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NzAzNjYsImV4cCI6MjA2NDM0NjM2Nn0.aEmZFQch-nZbnHnsjQmdwAUHubvC8MPThTvUmvlXGfc';                      // ⬅️ Reemplaza esto
    const supabase = createClient(supabaseUrl, supabaseKey);

    // C. Lógica de login
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const messageEl = document.getElementById('message');
            const username = document.getElementById('username')?.value.trim();
            const password = document.getElementById('password')?.value.trim();

            if (!username || !password) {
                showMessage(messageEl, 'Por favor complete todos los campos', 'error');
                return;
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 800));

                const { data, error } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('nombre', username)
                    .eq('contraseña', password)
                    .single();

                if (error || !data) throw new Error('Usuario o contraseña incorrectos');

                localStorage.setItem('currentUser', JSON.stringify(data));
                showMessage(messageEl, '¡Inicio exitoso! Redirigiendo...', 'success');

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } catch (error) {
                showMessage(messageEl, error.message, 'error');
                shakeElement(document.querySelector('.login-container'));
            }
        });
    }

    // D. Funciones auxiliares
    function showMessage(element, text, type) {
        if (!element) return;
        element.textContent = text;
        element.classList.remove('error', 'success');
        element.classList.add(type);
    }

    function shakeElement(element) {
        if (!element) return;
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
})();
