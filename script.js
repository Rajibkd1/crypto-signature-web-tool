// Utility functions
function pemToArrayBuffer(pem) {
    try {
      const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
      const binaryStr = atob(b64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
      return bytes.buffer;
    } catch (error) {
      throw new Error('Invalid PEM format');
    }
  }
  
  function arrayBufferToPem(buffer, type) {
    const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const wrapped = base64String.replace(/(.{64})/g, '$1\n');
    if(type === 'public') {
      return `-----BEGIN PUBLIC KEY-----\n${wrapped}\n-----END PUBLIC KEY-----`;
    } else if(type === 'private') {
      return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----`;
    } else {
      throw new Error("Invalid PEM type");
    }
  }
  
  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.trim());
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }
  
  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }
  
  function downloadText(filename, text) {
    const blob = new Blob([text], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // Enhanced notification system
  function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    
    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || icons.info}</span>
      <span class="notification-text">${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification);
        }
      }, 300);
    }, duration);
  }
  
  // Crypto functions
  async function generateKeyPair() {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-PSS",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        true,
        ["sign", "verify"]
      );
      
      const pubKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  
      return {
        publicKeyPem: arrayBufferToPem(pubKeyBuffer, 'public'),
        privateKeyPem: arrayBufferToPem(privKeyBuffer, 'private'),
        privateKey: keyPair.privateKey,
        publicKey: keyPair.publicKey
      };
    } catch (error) {
      throw new Error('Failed to generate key pair: ' + error.message);
    }
  }
  
  async function importPrivateKey(pem) {
    try {
      const binary = pemToArrayBuffer(pem);
      return await crypto.subtle.importKey(
        "pkcs8",
        binary,
        {
          name: "RSA-PSS",
          hash: "SHA-256"
        },
        true,
        ["sign"]
      );
    } catch(e) {
      throw new Error("Invalid private key format or corrupted key data");
    }
  }
  
  async function importPublicKey(pem) {
    try {
      const binary = pemToArrayBuffer(pem);
      return await crypto.subtle.importKey(
        "spki",
        binary,
        {
          name: "RSA-PSS",
          hash: "SHA-256"
        },
        true,
        ["verify"]
      );
    } catch(e) {
      throw new Error("Invalid public key format or corrupted key data");
    }
  }
  
  async function signData(privateKey, data) {
    try {
      return await crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        privateKey,
        data
      );
    } catch (error) {
      throw new Error('Failed to sign data: ' + error.message);
    }
  }
  
  async function verifyData(publicKey, signature, data) {
    try {
      return await crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        publicKey,
        signature,
        data
      );
    } catch (error) {
      throw new Error('Failed to verify signature: ' + error.message);
    }
  }
  
  // DOM elements
  const instructionToggle = document.getElementById('instructionToggle');
  const instructionContent = document.getElementById('instructionContent');
  
  const generateKeysBtn = document.getElementById('generateKeysBtn');
  const publicKeyOutput = document.getElementById('publicKeyOutput');
  const privateKeyOutput = document.getElementById('privateKeyOutput');
  const downloadPublicKeyBtn = document.getElementById('downloadPublicKeyBtn');
  const downloadPrivateKeyBtn = document.getElementById('downloadPrivateKeyBtn');
  
  const signTextTab = document.getElementById('sign-text-tab');
  const signFileTab = document.getElementById('sign-file-tab');
  const signTextPanel = document.getElementById('sign-text-panel');
  const signFilePanel = document.getElementById('sign-file-panel');
  const signDocumentInput = document.getElementById('signDocumentInput');
const signFileInput = document.getElementById('signFileInput');
const privateKeyInput = document.getElementById('privateKeyInput');
const privateKeyFileBtn = document.getElementById('privateKeyFileBtn');
const privateKeyUpload = document.getElementById('privateKeyUpload');
const signBtn = document.getElementById('signBtn');
const signatureOutput = document.getElementById('signatureOutput');
const downloadSignatureBtn = document.getElementById('downloadSignatureBtn');

const verifyFileInput = document.getElementById('verifyFileInput');
const publicKeyUploadInput = document.getElementById('publicKeyUploadInput');
const signatureUploadInput = document.getElementById('signatureUploadInput');
const verifyBtn = document.getElementById('verifyBtn');
const verifyResult = document.getElementById('verifyResult');

// Instruction toggle functionality
instructionToggle.addEventListener('click', () => {
  const isExpanded = instructionToggle.getAttribute('aria-expanded') === 'true';
  
  if (isExpanded) {
    instructionToggle.setAttribute('aria-expanded', 'false');
    instructionContent.classList.remove('expanded');
  } else {
    instructionToggle.setAttribute('aria-expanded', 'true');
    instructionContent.classList.add('expanded');
  }
});

// Enhanced copy buttons with better feedback
const copyButtons = document.querySelectorAll('button.copy-btn');
copyButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.getAttribute('data-target');
    const targetTextarea = document.getElementById(targetId);
    if (!targetTextarea || !targetTextarea.value.trim()) {
      showNotification('Nothing to copy!', 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(targetTextarea.value);
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">✅</span> Copied!';
      btn.classList.add('copied');
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('copied');
        btn.disabled = false;
      }, 2000);
      
      showNotification('Copied to clipboard!', 'success');
    } catch (error) {
      showNotification('Failed to copy to clipboard', 'error');
    }
  });
});

// Enhanced key generation with loading state
generateKeysBtn.addEventListener('click', async () => {
  generateKeysBtn.disabled = true;
  generateKeysBtn.innerHTML = '<span class="btn-icon">🔄</span><span class="btn-text">Generating Keys...</span>';
  generateKeysBtn.classList.add('loading');
  
  try {
    const keyPair = await generateKeyPair();
    publicKeyOutput.value = keyPair.publicKeyPem;
    privateKeyOutput.value = keyPair.privateKeyPem;
    showNotification('🎉 Key pair generated successfully!', 'success');
  } catch (e) {
    showNotification('❌ Error generating keys: ' + e.message, 'error');
  } finally {
    generateKeysBtn.disabled = false;
    generateKeysBtn.innerHTML = '<span class="btn-icon">🎲</span><span class="btn-text">Generate New Key Pair</span>';
    generateKeysBtn.classList.remove('loading');
  }
});

// Enhanced download functionality
downloadPublicKeyBtn.addEventListener('click', () => {
  if (publicKeyOutput.value.trim()) {
    downloadText("public_key.pem", publicKeyOutput.value.trim());
    showNotification('📥 Public key downloaded!', 'success');
  } else {
    showNotification('⚠️ No public key to download', 'warning');
  }
});

downloadPrivateKeyBtn.addEventListener('click', () => {
  if (privateKeyOutput.value.trim()) {
    downloadText("private_key.pem", privateKeyOutput.value.trim());
    showNotification('📥 Private key downloaded!', 'success');
  } else {
    showNotification('⚠️ No private key to download', 'warning');
  }
});

// Enhanced tabs for sign input mode
function activateSignTab(tab) {
  if(tab === 'text') {
    signTextTab.classList.add('active');
    signTextTab.setAttribute('aria-selected', 'true');
    signTextTab.tabIndex = 0;
    signFileTab.classList.remove('active');
    signFileTab.setAttribute('aria-selected', 'false');
    signFileTab.tabIndex = -1;
    signTextPanel.hidden = false;
    signFilePanel.hidden = true;
  } else {
    signTextTab.classList.remove('active');
    signTextTab.setAttribute('aria-selected', 'false');
    signTextTab.tabIndex = -1;
    signFileTab.classList.add('active');
    signFileTab.setAttribute('aria-selected', 'true');
    signFileTab.tabIndex = 0;
    signTextPanel.hidden = true;
    signFilePanel.hidden = false;
  }
}

signTextTab.addEventListener('click', () => activateSignTab('text'));
signFileTab.addEventListener('click', () => activateSignTab('file'));

// Enhanced private key file loading
privateKeyFileBtn.addEventListener('click', () => {
  privateKeyUpload.click();
});

privateKeyUpload.addEventListener('change', async () => {
  if(privateKeyUpload.files.length !== 1) return;
  
  try {
    const text = await readFileAsText(privateKeyUpload.files[0]);
    privateKeyInput.value = text;
    showNotification('🔑 Private key loaded successfully!', 'success');
  } catch (error) {
    showNotification('❌ Failed to read private key file', 'error');
  }
  privateKeyUpload.value = '';
});

// Enhanced signing functionality
signBtn.addEventListener('click', async () => {
  signatureOutput.value = "";
  let dataBuffer;
  const privPem = privateKeyInput.value.trim();
  
  if(!privPem) {
    showNotification('⚠️ Please provide your private key', 'warning');
    return;
  }

  try {
    if(signTextPanel.hidden === false) {
      const text = signDocumentInput.value.trim();
      if(!text) {
        showNotification('⚠️ Please enter document text to sign', 'warning');
        return;
      }
      const encoder = new TextEncoder();
      dataBuffer = encoder.encode(text);
    } else {
      if(signFileInput.files.length !== 1) {
        showNotification('⚠️ Please select one file to sign', 'warning');
        return;
      }
      dataBuffer = await readFileAsArrayBuffer(signFileInput.files[0]);
    }
  } catch (e) {
    showNotification('❌ Failed to read input data: ' + e.message, 'error');
    return;
  }

  signBtn.disabled = true;
  signBtn.innerHTML = '<span class="btn-icon">🔄</span><span class="btn-text">Creating Signature...</span>';
  signBtn.classList.add('loading');

  try {
    const privKey = await importPrivateKey(privPem);
    const sigBuffer = await signData(privKey, dataBuffer);
    const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
    signatureOutput.value = sigBase64;
    showNotification('🎉 Document signed successfully!', 'success');
  } catch(e) {
    showNotification('❌ Error signing data: ' + e.message, 'error');
  } finally {
    signBtn.disabled = false;
    signBtn.innerHTML = '<span class="btn-icon">🖊️</span><span class="btn-text">Create Signature</span>';
    signBtn.classList.remove('loading');
  }
});

// Enhanced signature download
downloadSignatureBtn.addEventListener('click', () => {
  if(signatureOutput.value.trim()) {
    downloadText("signature.txt", signatureOutput.value.trim());
    showNotification('📥 Signature downloaded!', 'success');
  } else {
    showNotification('⚠️ No signature available to download', 'warning');
  }
});

// Enhanced verification functionality
verifyBtn.addEventListener('click', async () => {
  verifyResult.style.display = 'none';
  verifyResult.classList.remove('error');
  verifyResult.textContent = "";

  if(verifyFileInput.files.length !== 1) {
    showNotification('⚠️ Please select one file to verify', 'warning');
    return;
  }
  if(publicKeyUploadInput.files.length !== 1) {
    showNotification('⚠️ Please select the public key file', 'warning');
    return;
  }
  if(signatureUploadInput.files.length !== 1) {
    showNotification('⚠️ Please select the signature file', 'warning');
    return;
  }

  verifyBtn.disabled = true;
  verifyBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Verifying Signature...</span>';
  verifyBtn.classList.add('loading');

  try {
    const [fileBuffer, pubPem, sigText] = await Promise.all([
      readFileAsArrayBuffer(verifyFileInput.files[0]),
      readFileAsText(publicKeyUploadInput.files[0]),
      readFileAsText(signatureUploadInput.files[0]),
    ]);

    const pubKey = await importPublicKey(pubPem);
    const sigArray = Uint8Array.from(atob(sigText), c => c.charCodeAt(0));
    const valid = await verifyData(pubKey, sigArray, fileBuffer);

    verifyResult.style.display = 'block';
    if(valid) {
      verifyResult.classList.remove('error');
      verifyResult.textContent = "🎉 SIGNATURE VERIFIED ✅\n\nThe digital signature is authentic and the document has not been tampered with. You can trust this document's integrity and origin.";
      showNotification('🎉 Signature is valid!', 'success');
    } else {
      verifyResult.classList.add('error');
      verifyResult.textContent = "⚠️ SIGNATURE INVALID ❌\n\nThe digital signature could not be verified. This may indicate:\n• The document has been modified\n• Wrong public key used\n• Corrupted signature file\n• Document is not authentic";
      showNotification('❌ Signature verification failed', 'error');
    }
  } catch(e) {
    verifyResult.style.display = 'block';
    verifyResult.classList.add('error');
    verifyResult.textContent = "💥 VERIFICATION ERROR\n\nFailed to verify signature: " + e.message + "\n\nPlease check:\n• File formats are correct\n• Files are not corrupted\n• Public key matches the signing key";
    showNotification('❌ Verification error: ' + e.message, 'error');
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Verify Signature</span>';
    verifyBtn.classList.remove('loading');
  }
});

// Enhanced main section tabs with smooth transitions
const generateKeyTab = document.getElementById('generateKeyTab');
const signDocumentTab = document.getElementById('signDocumentTab');
const verifyDocumentTab = document.getElementById('verifyDocumentTab');

function activateMainTab(tab) {
  const panels = [
    document.getElementById('generateKeyPanel'), 
    document.getElementById('signDocumentPanel'), 
    document.getElementById('verifyDocumentPanel')
  ];
  
  // Hide all panels with fade effect
  panels.forEach(panel => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(20px)';
    setTimeout(() => {
      panel.hidden = true;
    }, 150);
  });

  // Reset all tab states
  [generateKeyTab, signDocumentTab, verifyDocumentTab].forEach(tabBtn => {
    tabBtn.classList.remove('active');
    tabBtn.setAttribute('aria-selected', 'false');
    tabBtn.tabIndex = -1;
  });

  // Activate selected tab and panel
  setTimeout(() => {
    if (tab === 'generate') {
      generateKeyTab.classList.add('active');
      generateKeyTab.setAttribute('aria-selected', 'true');
      generateKeyTab.tabIndex = 0;
      panels[0].hidden = false;
      setTimeout(() => {
        panels[0].style.opacity = '1';
        panels[0].style.transform = 'translateY(0)';
      }, 50);
    } else if (tab === 'sign') {
      signDocumentTab.classList.add('active');
      signDocumentTab.setAttribute('aria-selected', 'true');
      signDocumentTab.tabIndex = 0;
      panels[1].hidden = false;
      setTimeout(() => {
        panels[1].style.opacity = '1';
        panels[1].style.transform = 'translateY(0)';
      }, 50);
    } else if (tab === 'verify') {
      verifyDocumentTab.classList.add('active');
      verifyDocumentTab.setAttribute('aria-selected', 'true');
      verifyDocumentTab.tabIndex = 0;
      panels[2].hidden = false;
      setTimeout(() => {
        panels[2].style.opacity = '1';
        panels[2].style.transform = 'translateY(0)';
      }, 50);
    }
  }, 150);
}

generateKeyTab.addEventListener('click', () => activateMainTab('generate'));
signDocumentTab.addEventListener('click', () => activateMainTab('sign'));
verifyDocumentTab.addEventListener('click', () => activateMainTab('verify'));

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') return; // Let normal tab navigation work
  
  const activeTab = document.querySelector('.tab.active');
  if (!activeTab) return;

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const tabs = Array.from(document.querySelectorAll('.tabs .tab'));
    const currentIndex = tabs.indexOf(activeTab);
    let nextIndex;

    if (e.key === 'ArrowLeft') {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else {
      nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    }

    tabs[nextIndex].click();
    tabs[nextIndex].focus();
  }
});

// Enhanced drag and drop functionality for file inputs
function setupDragAndDrop(inputElement) {
  const wrapper = inputElement.closest('.file-input-wrapper');
  if (!wrapper) return;
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    wrapper.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    wrapper.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    wrapper.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    wrapper.classList.add('drag-over');
  }

  function unhighlight() {
    wrapper.classList.remove('drag-over');
  }

  wrapper.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        inputElement.files = files;
        const fileName = files[0].name;
        showNotification(`📁 ${fileName} loaded successfully!`, 'success');
        
        // Update file input overlay text
        const overlay = wrapper.querySelector('.file-input-overlay .file-text');
        if (overlay) {
          overlay.textContent = `Selected: ${fileName}`;
        }
        
        // Trigger change event for file processing
        const event = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(event);
      }
    }
  }
  
  // Setup drag and drop for all file inputs
  [verifyFileInput, publicKeyUploadInput, signatureUploadInput, signFileInput].forEach(input => {
    setupDragAndDrop(input);
    
    // Update overlay text when file is selected normally
    input.addEventListener('change', () => {
      const wrapper = input.closest('.file-input-wrapper');
      const overlay = wrapper?.querySelector('.file-input-overlay .file-text');
      if (overlay && input.files.length > 0) {
        overlay.textContent = `Selected: ${input.files[0].name}`;
      } else if (overlay) {
        // Reset to default text based on input type
        const defaultTexts = {
          'verifyFileInput': 'Choose document file',
          'publicKeyUploadInput': 'Choose public key file',
          'signatureUploadInput': 'Choose signature file',
          'signFileInput': 'Choose file or drag & drop'
        };
        overlay.textContent = defaultTexts[input.id] || 'Choose file';
      }
    });
  });
  
  // Enhanced auto-save functionality for text areas
  function setupAutoSave(textareaId, storageKey) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;
  
    // Load saved content
    const saved = localStorage.getItem(storageKey);
    if (saved && !textarea.value) {
      textarea.value = saved;
      showNotification('📝 Previous content restored', 'info', 2000);
    }
  
    // Save on input with debounce
    let saveTimeout;
    textarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        if (textarea.value.trim()) {
          localStorage.setItem(storageKey, textarea.value);
        } else {
          localStorage.removeItem(storageKey);
        }
      }, 1000);
    });
  
    // Clear saved content when textarea is manually cleared
    textarea.addEventListener('blur', () => {
      if (!textarea.value.trim()) {
        localStorage.removeItem(storageKey);
      }
    });
  }
  
  // Setup auto-save for key text areas
  setupAutoSave('signDocumentInput', 'digitalsign_document_text');
  setupAutoSave('privateKeyInput', 'digitalsign_private_key');
  
  // Enhanced security warnings
  function showSecurityWarning() {
    const warning = document.createElement('div');
    warning.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: fadeIn 0.3s ease-out;
      ">
        <div style="
          background: white;
          padding: 2.5rem;
          border-radius: 1rem;
          max-width: 500px;
          margin: 1rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          animation: slideIn 0.3s ease-out;
        ">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
            <h3 style="color: #e53e3e; margin: 0; font-size: 1.5rem;">Security Notice</h3>
          </div>
          <div style="margin-bottom: 2rem; line-height: 1.6; color: #4a5568;">
            <p style="margin-bottom: 1rem;"><strong>Important:</strong> Keep your private key secure and never share it with anyone.</p>
            <p style="margin-bottom: 1rem;">Your private key is used to create digital signatures and should be treated like a password.</p>
            <p style="margin: 0; font-size: 0.9rem; color: #718096;">
              This tool runs entirely in your browser. Your keys and documents never leave your device.
            </p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
            font-size: 1rem;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            I Understand
          </button>
        </div>
      </div>
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(warning);
  }
  
  // Show security warning on first private key generation
  let hasShownWarning = localStorage.getItem('digitalsign_security_warning');
  generateKeysBtn.addEventListener('click', () => {
    if (!hasShownWarning) {
      setTimeout(() => {
        showSecurityWarning();
        localStorage.setItem('digitalsign_security_warning', 'true');
      }, 1000);
      hasShownWarning = true;
    }
  });
  
  // Enhanced file validation
  function validateFile(file, allowedTypes, maxSize = 10 * 1024 * 1024) { // 10MB default
    if (!file) return { valid: false, error: 'No file selected' };
    
    if (allowedTypes && !allowedTypes.some(type => file.name.toLowerCase().endsWith(type))) {
      return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` };
    }
    
    return { valid: true };
  }
  
  // Add file validation to relevant inputs
  publicKeyUploadInput.addEventListener('change', () => {
    if (publicKeyUploadInput.files.length > 0) {
      const validation = validateFile(publicKeyUploadInput.files[0], ['.pem', '.txt']);
      if (!validation.valid) {
        showNotification(`❌ ${validation.error}`, 'error');
        publicKeyUploadInput.value = '';
      }
    }
  });
  
  signatureUploadInput.addEventListener('change', () => {
    if (signatureUploadInput.files.length > 0) {
      const validation = validateFile(signatureUploadInput.files[0], ['.txt']);
      if (!validation.valid) {
        showNotification(`❌ ${validation.error}`, 'error');
        signatureUploadInput.value = '';
      }
    }
  });
  
  // Enhanced error handling for crypto operations
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred. Please try again.', 'error');
    event.preventDefault();
  });
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
        console.log(`🚀 Digital Signature Tool loaded in ${loadTime}ms`);
        
        // Show performance notification for very slow loads
        if (loadTime > 3000) {
          showNotification('⚡ App loaded. For better performance, try using a modern browser.', 'info');
        }
      }, 0);
    });
  }
  
  // Initialize application
  document.addEventListener('DOMContentLoaded', () => {
    // Set initial panel styles for smooth transitions
    const panels = [
      document.getElementById('generateKeyPanel'), 
      document.getElementById('signDocumentPanel'), 
      document.getElementById('verifyDocumentPanel')
    ];
    
    panels.forEach((panel, index) => {
      panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (index === 0) {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
      } else {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
      }
    });
  
    // Initialize first tab as active
    activateMainTab('generate');
    
    // Show welcome notification
    setTimeout(() => {
      showNotification('🔐 Welcome to Digital Signature Tool! Generate keys to get started.', 'info', 5000);
    }, 1000);
  });
  
  // Cleanup function for when page is unloaded
  window.addEventListener('beforeunload', () => {
    // Clear sensitive data from memory if needed
    if (privateKeyOutput.value) {
      privateKeyOutput.value = '';
    }
    if (privateKeyInput.value) {
      privateKeyInput.value = '';
    }
  });
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + G for Generate Keys
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
      e.preventDefault();
      generateKeyTab.click();
      generateKeysBtn.focus();
    }
    
    // Ctrl/Cmd + S for Sign Document
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      signDocumentTab.click();
    }
    
    // Ctrl/Cmd + V for Verify Document
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      verifyDocumentTab.click();
    }
    
    // Escape to close instruction panel
    if (e.key === 'Escape' && instructionToggle.getAttribute('aria-expanded') === 'true') {
      instructionToggle.click();
    }
  });
  
  // Add tooltips for better UX (simple implementation)
  function addTooltip(element, text) {
    element.setAttribute('title', text);
    element.style.cursor = 'help';
  }
  
  // Add helpful tooltips
  addTooltip(downloadPublicKeyBtn, 'Download your public key as a .pem file');
  addTooltip(downloadPrivateKeyBtn, 'Download your private key as a .pem file (keep secure!)');
  addTooltip(downloadSignatureBtn, 'Download the generated signature as a .txt file');
  
  // Easter egg - Konami code
  let konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
      showNotification('🎉 Konami Code activated! You are a true crypto enthusiast!', 'success', 6000);
      konamiCode = [];
      
      // Add some fun visual effect
      document.body.style.animation = 'float 2s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 2000);
    }
  });
  
  // Export functions for potential future use or testing
  window.DigitalSignatureTool = {
    generateKeyPair,
    importPrivateKey,
    importPublicKey,
    signData,
    verifyData,
    showNotification,
    activateMainTab
  };