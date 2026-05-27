/* ==========================================================================
   API INTEGRATION HUB - GITHUB EXPLORER MODULE (github.js)
   ========================================================================== */

window.GitHubController = {
    // Map popular repository languages to standard GitHub badge colors
    languageColors: {
        'javascript': '#f1e05a',
        'typescript': '#3178c6',
        'python': '#3572a5',
        'html': '#e34c26',
        'css': '#563d7c',
        'ruby': '#701516',
        'go': '#00add8',
        'java': '#b07219',
        'c++': '#f34b7d',
        'c#': '#178600',
        'php': '#4f5d95',
        'rust': '#dea584',
        'shell': '#89e051',
        'swift': '#f05138'
    },

    init() {
        this.resultsContainer = document.getElementById('github-results');
        this.searchForm = document.getElementById('github-search-form');
        this.usernameInput = document.getElementById('github-username');
        
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = this.usernameInput.value.trim();
                if (username) {
                    this.fetchGitHubUser(username);
                }
            });
        }
    },

    renderSkeleton() {
        this.resultsContainer.innerHTML = `
            <div class="skeleton-loader">
                <!-- User profile card skeleton -->
                <div class="github-profile-card" style="box-shadow: none;">
                    <div class="github-user-info">
                        <div class="skeleton-block skeleton-avatar"></div>
                        <div class="github-meta" style="flex: 1; gap: 8px;">
                            <div class="skeleton-block skeleton-text heading" style="width: 40%;"></div>
                            <div class="skeleton-block skeleton-text" style="width: 25%;"></div>
                        </div>
                    </div>
                    
                    <div class="skeleton-block skeleton-text" style="margin-top: 10px;"></div>
                    <div class="skeleton-block skeleton-text short" style="width: 70%;"></div>
                    
                    <div class="github-details-grid">
                        <div class="skeleton-block skeleton-text" style="height: 14px;"></div>
                        <div class="skeleton-block skeleton-text" style="height: 14px;"></div>
                        <div class="skeleton-block skeleton-text" style="height: 14px;"></div>
                    </div>
                    
                    <div class="github-stats">
                        <div class="skeleton-block skeleton-rect" style="height: 64px; border-radius: var(--radius-sm);"></div>
                        <div class="skeleton-block skeleton-rect" style="height: 64px; border-radius: var(--radius-sm);"></div>
                        <div class="skeleton-block skeleton-rect" style="height: 64px; border-radius: var(--radius-sm);"></div>
                    </div>
                </div>
                
                <!-- Repos title skeleton -->
                <div class="skeleton-block skeleton-text heading" style="width: 25%; margin-top: 10px;"></div>
                
                <!-- Repos cards skeleton -->
                <div class="repos-grid">
                    <div class="skeleton-block skeleton-rect" style="height: 120px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 120px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 120px;"></div>
                    <div class="skeleton-block skeleton-rect" style="height: 120px;"></div>
                </div>
            </div>
        `;
    },

    async fetchGitHubUser(username) {
        this.renderSkeleton();
        
        try {
            // Perform parallel API fetches for optimum latency speed
            const userUrl = `https://api.github.com/users/${username}`;
            const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;
            
            const [userRes, reposRes] = await Promise.all([
                fetch(userUrl),
                fetch(reposUrl)
            ]);
            
            // Handle HTTP Errors
            if (userRes.status === 404) {
                this.renderErrorState(`User "${username}" Not Found`, "Please check the spelling or search for another developer profile.", true);
                return;
            }
            
            if (userRes.status === 403 || reposRes.status === 403) {
                this.renderErrorState("API Rate Limit Exceeded", "GitHub limits public searches to 60 queries/hr for unauthenticated connections. Please try again in a bit.", false);
                return;
            }
            
            if (!userRes.ok || !reposRes.ok) {
                throw new Error("GitHub service returned an internal error.");
            }
            
            const userData = await userRes.json();
            const reposData = await reposRes.json();
            
            this.renderGitHubProfile(userData, reposData);
            window.APIHub.showToast(`GitHub profile for ${username} loaded!`, 'success');
            
        } catch (err) {
            console.error(err);
            this.renderErrorState("Search Operation Failed", "Unable to establish communication with GitHub API servers. Please check your internet connection.", false);
        }
    },

    renderGitHubProfile(user, repos) {
        // Formatter for large stats numbers
        const formatStat = (num) => {
            return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
        };

        // Render repositories list
        let reposHtml = '';
        if (!repos || repos.length === 0) {
            reposHtml = `
                <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--text-secondary); font-size: 14px;">
                    This user doesn't have any public repositories.
                </div>
            `;
        } else {
            repos.forEach(repo => {
                const lang = repo.language;
                const langLower = lang ? lang.toLowerCase() : '';
                const dotColor = this.languageColors[langLower] || '#8b5cf6';
                
                reposHtml += `
                    <div class="repo-card">
                        <div class="repo-header">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link" title="Open repository on GitHub">
                                ${repo.name}
                            </a>
                        </div>
                        <p class="repo-desc">${repo.description || 'No description provided.'}</p>
                        <div class="repo-footer">
                            ${lang ? `
                                <span class="repo-lang">
                                    <span class="repo-lang-dot" style="background-color: ${dotColor};"></span>
                                    <span>${lang}</span>
                                </span>
                            ` : '<span>General</span>'}
                            
                            <div class="repo-meta-stats">
                                <span class="repo-stat-item" title="Stars">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span>${formatStat(repo.stargazers_count)}</span>
                                </span>
                                <span class="repo-stat-item" title="Forks">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <circle cx="18" cy="18" r="3"></circle>
                                        <circle cx="6" cy="6" r="3"></circle>
                                        <circle cx="6" cy="18" r="3"></circle>
                                        <path d="M18 15V9a4 4 0 0 0-4-4H9"></path>
                                        <line x1="6" y1="9" x2="6" y2="15"></line>
                                    </svg>
                                    <span>${formatStat(repo.forks_count)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Render complete component card
        this.resultsContainer.innerHTML = `
            <div class="github-profile-card animate-fade-in">
                <!-- User Core Information Row -->
                <div class="github-user-info">
                    <img class="github-avatar" src="${user.avatar_url}" alt="${user.login}'s profile avatar">
                    <div class="github-meta">
                        <div class="github-name-row">
                            <h3 class="github-name">${user.name || user.login}</h3>
                            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="github-username">
                                @${user.login}
                            </a>
                        </div>
                        <p class="github-bio">${user.bio || 'This developer has no bio in their profile.'}</p>
                    </div>
                </div>
                
                <!-- Additional User details (Location, Blog, Twitter) -->
                <div class="github-details-grid">
                    <div class="github-detail-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>${user.location || 'Not Specified'}</span>
                    </div>
                    <div class="github-detail-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>${user.email || 'Private Email'}</span>
                    </div>
                    <div class="github-detail-item">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        ${user.blog ? `
                            <a href="${user.blog.startsWith('http') ? user.blog : 'https://' + user.blog}" target="_blank" rel="noopener noreferrer" style="color: var(--text-secondary); text-decoration: none; word-break: break-all;">
                                ${user.blog.replace(/(^\w+:|^)\/\//, '')}
                            </a>
                        ` : '<span>No website</span>'}
                    </div>
                </div>
                
                <!-- Main user followers/repos stats counts -->
                <div class="github-stats">
                    <div class="github-stat-card">
                        <span class="github-stat-val">${formatStat(user.public_repos)}</span>
                        <span class="github-stat-lbl">Repositories</span>
                    </div>
                    <div class="github-stat-card">
                        <span class="github-stat-val">${formatStat(user.followers)}</span>
                        <span class="github-stat-lbl">Followers</span>
                    </div>
                    <div class="github-stat-card">
                        <span class="github-stat-val">${formatStat(user.following)}</span>
                        <span class="github-stat-lbl">Following</span>
                    </div>
                </div>
            </div>
            
            <!-- Dynamic Repos grid header -->
            <h4 class="repos-section-title">Recently Updated Repositories</h4>
            <div class="repos-grid">
                ${reposHtml}
            </div>
        `;
    },

    renderErrorState(title, description, showRetry = true) {
        this.resultsContainer.innerHTML = `
            <div class="error-state animate-scale-in">
                <div class="error-icon">⚠️</div>
                <h3>${title}</h3>
                <p>${description}</p>
                ${showRetry ? `
                    <button class="btn btn-secondary btn-retry" id="btn-github-retry">
                        Reset Search
                    </button>
                ` : ''}
            </div>
        `;
        
        if (showRetry) {
            document.getElementById('btn-github-retry').addEventListener('click', () => {
                this.usernameInput.value = '';
                this.resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🐙</div>
                        <h3>Find Any Developer</h3>
                        <p>Enter a username above to search profiles, view metrics, and inspect repositories in real-time.</p>
                    </div>
                `;
                this.usernameInput.focus();
            });
        }
    }
};
