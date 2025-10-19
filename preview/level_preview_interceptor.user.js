// ==UserScript==
// @name         Cut the Rope Level Preview Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercepts XML level downloads and redirects to preview URL
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function encodeBase64UTF8(str) {
        try {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(str);
            
            let binaryString = '';
            for (let i = 0; i < bytes.length; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }
            
            return btoa(binaryString);
        } catch (error) {
            console.error('Error encoding UTF-8 to base64:', error);
            return btoa(str);
        }
    }

    function createPreviewUrl(xmlData) {
        try {
            const base64Data = encodeBase64UTF8(xmlData);
            
            const urlEncoded = encodeURIComponent(base64Data);
            
            const previewUrl = `https://candies.monster/preview?data=${urlEncoded}`;
            
            return previewUrl;
        } catch (error) {
            console.error('Error creating preview URL:', error);
            return null;
        }
    }

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const [url, options] = args;
        
        if (options && options.method === 'GET' && 
            (url.includes('.xml') || 
             (options.headers && options.headers['Accept'] && options.headers['Accept'].includes('xml')))) {
            
            return originalFetch.apply(this, args).then(response => {
                const clonedResponse = response.clone();
                
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('xml')) {
                    clonedResponse.text().then(xmlData => {
                        const previewUrl = createPreviewUrl(xmlData);
                        if (previewUrl) {
                            console.log('Level preview URL:', previewUrl);
                            
                            window.open(previewUrl, '_blank');
                            
                            showNotification('Level preview opened in new tab!');
                        }
                    }).catch(err => {
                        console.error('Error reading XML response:', err);
                    });
                }
                
                return response;
            });
        }
        
        return originalFetch.apply(this, args);
    };

    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        const xhr = this;
        
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr._method === 'GET' && 
                    (xhr._url.includes('.xml') || 
                     xhr.getResponseHeader('content-type')?.includes('xml'))) {
                    
                    try {
                        const xmlData = xhr.responseText;
                        const previewUrl = createPreviewUrl(xmlData);
                        
                        if (previewUrl) {
                            console.log('Level preview URL:', previewUrl);
                            
                            window.open(previewUrl, '_blank');
                            
                            showNotification('Level preview opened in new tab!');
                        }
                    } catch (err) {
                        console.error('Error processing XML response:', err);
                    }
                }
            }
            
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };
        
        return originalXHRSend.apply(this, arguments);
    };

    document.addEventListener('click', function(event) {
        const target = event.target;
        
        if (target.tagName === 'A' && target.href) {
            const href = target.href;
            
            if (href.includes('.xml') || href.includes('download') || href.includes('export')) {
                event.preventDefault();
                
                fetch(href)
                    .then(response => response.text())
                    .then(xmlData => {
                        const previewUrl = createPreviewUrl(xmlData);
                        if (previewUrl) {
                            console.log('Level preview URL:', previewUrl);
                            
                            window.open(previewUrl, '_blank');
                            
                            showNotification('Level preview opened in new tab!');
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching XML:', err);
                        window.location.href = href;
                    });
            }
        }
    });

    function showNotification(message) {
        const existingNotification = document.getElementById('level-preview-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.id = 'level-preview-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    console.log('Cut the Rope Level Preview Interceptor loaded!');
})();
