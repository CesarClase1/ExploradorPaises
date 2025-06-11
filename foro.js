    const storedUser = localStorage.getItem('currentUser');
    let user = storedUser ? JSON.parse(storedUser) : null;

    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('comment-text');
    const commentsDiv = document.getElementById('comments');
    const loginMsg = document.getElementById('login-msg');
    const filterBar = document.getElementById('filter-bar');

    const paises = [
      'japon', 'inglaterra', 'francia', 'alemania', 'china',
      'mexico', 'brasil', 'argentina', 'canada', 'australia'
    ];

    let filtroActivo = null;

    if (!user || !user.nombre) {
      loginMsg.textContent = "Debes estar logueado para comentar.";
    } else {
      commentForm.style.display = 'flex';
      loginMsg.textContent = "";
    }

    function crearFiltro() {
      filterBar.innerHTML = '';

      paises.forEach(pais => {
        const btn = document.createElement('button');
        btn.textContent = `#${pais}`;
        btn.className = 'hashtag-btn';
        btn.addEventListener('click', () => {
          filtroActivo = pais;
          loadComments();
        });
        filterBar.appendChild(btn);
      });

      if (filtroActivo) {
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Mostrar Todo';
        clearBtn.className = 'hashtag-btn';
        clearBtn.id = 'clear-filter';
        clearBtn.addEventListener('click', () => {
          filtroActivo = null;
          loadComments();
        });
        filterBar.appendChild(clearBtn);
      }
    }

    function extraerHashtags(texto) {
      const regex = /#(\w+)/g;
      let matches = [];
      let match;
      while ((match = regex.exec(texto)) !== null) {
        matches.push(match[1].toLowerCase());
      }
      return matches;
    }

    function loadComments() {
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      commentsDiv.innerHTML = '';

      crearFiltro();

      let comentariosFiltrados = comments;
      if (filtroActivo) {
        comentariosFiltrados = comments.filter(c => {
          const hashtags = extraerHashtags(c.texto);
          return hashtags.includes(filtroActivo);
        });
      }

      if (comentariosFiltrados.length === 0) {
        commentsDiv.textContent = filtroActivo
          ? `No hay comentarios con #${filtroActivo}`
          : "No hay comentarios aún. ¡Sé el primero!";
        return;
      }

      comentariosFiltrados.slice().reverse().forEach((c, index) => {
        const div = document.createElement('div');
        div.classList.add('comment');

        const userSpan = document.createElement('span');
        userSpan.classList.add('comment-user');
        userSpan.textContent = c.usuario;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('comment-date');
        dateSpan.textContent = new Date(c.fecha).toLocaleString();

        const textP = document.createElement('p');
        textP.textContent = c.texto;

        div.appendChild(userSpan);
        div.appendChild(dateSpan);
        div.appendChild(textP);

        if (c.imagen) {
          const img = document.createElement('img');
          img.src = c.imagen;
          img.alt = 'Imagen subida por usuario';
          div.appendChild(img);
        }

        const hashtags = extraerHashtags(c.texto);
        if (hashtags.length > 0) {
          const hashDiv = document.createElement('div');
          hashDiv.className = 'hashtags-in-comment';

          hashtags.forEach(tag => {
            const tagLink = document.createElement('span');
            tagLink.className = 'hashtag-link';
            tagLink.textContent = `#${tag}`;
            tagLink.addEventListener('click', () => {
              filtroActivo = tag;
              loadComments();
            });
            hashDiv.appendChild(tagLink);
          });

          div.appendChild(hashDiv);
        }

        if (user && user.nombre === 'admin') {
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Eliminar';
          deleteBtn.classList.add('delete-btn');

          const originalIndex = comments.indexOf(c);
          deleteBtn.addEventListener('click', () => {
            comments.splice(originalIndex, 1);
            localStorage.setItem('comments', JSON.stringify(comments));
            loadComments();
          });
          div.appendChild(deleteBtn);
        }

        commentsDiv.appendChild(div);
      });
    }

    commentForm.addEventListener('submit', e => {
      e.preventDefault();
      const texto = commentText.value.trim();
      if (!texto) return;

      const fileInput = document.getElementById('comment-image');
      const file = fileInput.files[0];

      if (file) {
        if (!file.type.match('image/jpeg')) {
          alert('Solo se permiten imágenes JPG.');
          return;
        }
        if (file.size > 1024 * 1024) {
          alert('La imagen no debe superar 1MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
          guardarComentario(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        guardarComentario(null);
      }
    });

    function guardarComentario(imgDataUrl) {
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');

      comments.push({
        usuario: user.nombre,
        texto: commentText.value.trim(),
        fecha: new Date().toISOString(),
        imagen: imgDataUrl
      });

      localStorage.setItem('comments', JSON.stringify(comments));
      commentText.value = '';
      document.getElementById('comment-image').value = '';
      filtroActivo = null;
      loadComments();
    }

    loadComments();