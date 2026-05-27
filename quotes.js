/* ==========================================================================
   API INTEGRATION HUB - INSPIRATIONAL QUOTES MODULE (quotes.js)
   ========================================================================== */

window.QuotesController = {
    // Array of fallback offline quotes to ensure maximum resilience
    fallbackQuotes: [
        { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
        { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
        { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { quote: "An unexamined life is not worth living.", author: "Socrates" }
    ],

    init() {
        this.resultsContainer = document.getElementById('quotes-results');
        this.renderInitialState();
    },

    renderInitialState() {
        this.resultsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h3>Start Your Day With Motivation</h3>
                <p>Click the button below to fetch a dynamic, random inspirational quote from our public API network.</p>
                <button class="btn btn-primary" id="btn-initial-quote" style="margin-top: 16px;">
                    Get Inspired
                </button>
            </div>
        `;
        
        const initBtn = document.getElementById('btn-initial-quote');
        if (initBtn) {
            initBtn.addEventListener('click', () => this.fetchQuote());
        }
    },

    renderSkeleton() {
        this.resultsContainer.innerHTML = `
            <div class="skeleton-loader quote-card" style="box-shadow: none; border-style: solid;">
                <div class="skeleton-block skeleton-text heading" style="width: 30%;"></div>
                <div class="skeleton-block skeleton-text" style="height: 28px; margin-top: 10px;"></div>
                <div class="skeleton-block skeleton-text" style="height: 28px; width: 85%;"></div>
                <div class="skeleton-block skeleton-text short" style="margin-top: 10px; width: 40%;"></div>
                <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 20px; margin-top: 20px;">
                    <div style="display: flex; gap: 8px;">
                        <div class="skeleton-block" style="width: 38px; height: 38px; border-radius: 50%;"></div>
                        <div class="skeleton-block" style="width: 38px; height: 38px; border-radius: 50%;"></div>
                    </div>
                    <div class="skeleton-block" style="width: 120px; height: 38px; border-radius: var(--radius-md);"></div>
                </div>
            </div>
        `;
    },

    async fetchQuote() {
        this.renderSkeleton();
        
        // Timeout utility to handle stuck API requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        try {
            const response = await fetch('https://dummyjson.com/quotes/random', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderQuote(data.quote, data.author);
            window.APIHub.showToast('Dynamic quote fetched successfully!', 'success');
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.warn('Quotes API failed. Using local fallback quote repository.', error);
            
            // Render local fallback quote instead of showing error
            const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
            const fallback = this.fallbackQuotes[randomIndex];
            
            // Add a small delay for natural UX feel
            setTimeout(() => {
                this.renderQuote(fallback.quote, fallback.author);
                window.APIHub.showToast('Fetched quote from offline local storage.', 'warning');
            }, 600);
        }
    },

    renderQuote(text, author) {
        this.resultsContainer.innerHTML = `
            <div class="quote-card animate-fade-in">
                <blockquote class="quote-text">
                    "${text}"
                </blockquote>
                <cite class="quote-author">${author || 'Unknown'}</cite>
                
                <div class="quote-actions-row">
                    <div class="quote-tools">
                        <!-- Copy Button -->
                        <button class="icon-btn" id="btn-copy-quote" title="Copy Quote to Clipboard" aria-label="Copy to clipboard">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        
                        <!-- X Share Button -->
                        <button class="icon-btn" id="btn-share-quote" title="Share Quote on X" aria-label="Share on X">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Get New Quote Button -->
                    <button class="btn btn-primary" id="btn-new-quote">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 4px;">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
                        </svg>
                        Next Quote
                    </button>
                </div>
            </div>
        `;

        // Register Action Listeners
        document.getElementById('btn-new-quote').addEventListener('click', () => this.fetchQuote());
        document.getElementById('btn-copy-quote').addEventListener('click', () => this.copyToClipboard(text, author));
        document.getElementById('btn-share-quote').addEventListener('click', () => this.shareQuote(text, author));
    },

    copyToClipboard(text, author) {
        const fullText = `"${text}" — ${author}`;
        navigator.clipboard.writeText(fullText)
            .then(() => {
                window.APIHub.showToast('Quote copied to clipboard!', 'success');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                window.APIHub.showToast('Failed to copy. Please select and copy manually.', 'error');
            });
    },

    shareQuote(text, author) {
        const tweetText = encodeURIComponent(`"${text}" — ${author}\n\nShared from #APIHub`);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
        window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
};
