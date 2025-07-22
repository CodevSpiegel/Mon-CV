        // --- DONNÉES DES COMPÉTENCES POUR LA MODALE ---
        const skillsData = {
            webdev: {
                title: "Développement d'applications Web",
                description: "Maîtrise des fondamentaux du développement web pour créer des applications interactives et robustes. Capacité à structurer, styliser et rendre dynamiques les interfaces utilisateur, et à gérer la logique côté serveur.",
                tags: ["HTML", "CSS", "JavaScript", "PHP", "Conception UI/UX"]
            },
            prestashop: {
                title: "Expertise Prestashop",
                description: "Expérience dans la mise en production, la configuration et la personnalisation de sites e-commerce basés sur Prestashop. Compréhension des modules, thèmes et flux de commande.",
                tags: ["Prestashop", "E-commerce", "Mise en production", "Personnalisation"]
            },
            bdd: {
                title: "Gestion de Base de Données (SQL)",
                description: "Conception, administration et optimisation de bases de données relationnelles SQL. Maîtrise des requêtes complexes, gestion des utilisateurs et des permissions.",
                tags: ["SQL", "MySQL", "PostgreSQL", "Administration BDD", "Requêtes Optimisées"]
            },
            serveur: {
                title: "Administration Serveur (OVH)",
                description: "Compétences en gestion et maintenance de serveurs dédiés, notamment chez OVH. Inclut la configuration d'environnements web, la sécurité et la supervision des performances.",
                tags: ["OVH", "Serveur Dédié", "Linux (basique)", "Déploiement", "Maintenance Système"]
            }
        };

        // --- PARTIE JAVASCRIPT ---
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Gestion du mode sombre
            const themeToggle = document.getElementById('themeToggle');
            const body = document.body;
            const themeIcon = themeToggle.querySelector('i');

            // Vérifier si un thème préféré est enregistré
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                body.classList.add(savedTheme);
                if (savedTheme === 'dark-mode') {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            } else {
                // Détecter la préférence système par défaut (mode sombre)
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    body.classList.add('dark-mode');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }

            themeToggle.addEventListener('click', () => {
                body.classList.toggle('dark-mode');
                if (body.classList.contains('dark-mode')) {
                    localStorage.setItem('theme', 'dark-mode');
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    localStorage.setItem('theme', 'light-mode');
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                // Réinitialiser les particules pour qu'elles s'adaptent au nouveau thème si nécessaire
                if (typeof initParticles === 'function') {
                    initParticles();
                }
            });

            // 2. Animation d'apparition des cartes au défilement (Intersection Observer)
            const cards = document.querySelectorAll('.card');
            const appearOptions = {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            };

            const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        return;
                    } else {
                        entry.target.classList.add('fade-in');
                        appearOnScroll.unobserve(entry.target);
                    }
                });
            }, appearOptions);

            cards.forEach(card => {
                appearOnScroll.observe(card);
            });

            // 3. Gestion du Modale de Compétence
            const skillModal = document.getElementById('skillModal');
            const closeButton = document.querySelector('.close-button');
            const modalSkillTitle = document.getElementById('modalSkillTitle');
            const modalSkillDescription = document.getElementById('modalSkillDescription');
            const modalSkillTags = document.getElementById('modalSkillTags');

            document.querySelectorAll('.clickable-skill').forEach(tag => {
                tag.addEventListener('click', function() {
                    const skillKey = this.dataset.skill;
                    const skillInfo = skillsData[skillKey];

                    if (skillInfo) {
                        modalSkillTitle.textContent = skillInfo.title;
                        modalSkillDescription.textContent = skillInfo.description;
                        modalSkillTags.innerHTML = '';
                        skillInfo.tags.forEach(tagText => {
                            const span = document.createElement('span');
                            span.className = 'modal-skill-tag';
                            span.textContent = tagText;
                            modalSkillTags.appendChild(span);
                        });
                        skillModal.classList.add('show');
                        document.body.style.overflow = 'hidden'; // Empêche le défilement du corps
                    }
                });
            });

            closeButton.addEventListener('click', () => {
                skillModal.classList.remove('show');
                document.body.style.overflow = ''; // Rétablit le défilement du corps
            });

            skillModal.addEventListener('click', (e) => {
                if (e.target === skillModal) {
                    skillModal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            });

            // 4. Effet de fond "particules" dans l'en-tête (Canvas)
            const canvas = document.getElementById('headerBgCanvas');
            const ctx = canvas.getContext('2d');
            let particles = [];
            const particleCount = 50;

            function resizeCanvas() {
                canvas.width = header.offsetWidth;
                canvas.height = header.offsetHeight;
            }

            class Particle {
                constructor(x, y) {
                    this.x = x || Math.random() * canvas.width;
                    this.y = y || Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 0.5;
                    this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25;
                    // Définir la couleur en fonction du mode (sombre ou clair)
                    this.color = body.classList.contains('dark-mode') ?
                        `rgba(97, 175, 239, ${Math.random() * 0.5 + 0.2})` : // Primaire accent bleu pour le mode sombre
                        `rgba(52, 152, 219, ${Math.random() * 0.5 + 0.2})`;  // Primaire accent bleu pour le mode clair
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.size > 0.1) this.size -= 0.01;
                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                }
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            window.initParticles = function() { // Rendre globale pour le réinitialiser avec le mode sombre
                particles = [];
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }

            function animateParticles() {
                requestAnimationFrame(animateParticles);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].draw();
                    if (particles[i].size <= 0.1) {
                        particles.splice(i, 1);
                        particles.push(new Particle());
                    }
                }
            }

            const header = document.querySelector('header');
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            initParticles();
            animateParticles();
        });