(function () {
  'use strict';

  // ===== CSS =====
  const style = document.createElement('style');
  style.textContent = `
    #popupContactTrigger {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(41,171,226,0.9);
      color: white;
      border: none;
      border-radius: 9999px;
      padding: 0.55rem 0.55rem 0.55rem 1.25rem;
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.05em;
      transition: background 0.2s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    #popupContactTrigger:hover {
      background: rgba(26,146,196,1);
    }
    #popupContactTrigger .btn-arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: #fff;
      border-radius: 50%;
      color: #29ABE2;
      flex-shrink: 0;
    }
    #popupContactTrigger .btn-arrow .material-icons {
      font-size: 1rem;
    }
    #popupContactOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
    }
    #popupContactOverlay.active {
      opacity: 1;
      visibility: visible;
    }
    .popup-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      width: 90%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      position: relative;
      transform: scale(0.95);
      transition: transform 0.2s;
    }
    #popupContactOverlay.active .popup-content {
      transform: scale(1);
    }
    #popupCloseBtn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;
    }
    #popupCloseBtn:hover {
      background: #f1f5f9;
      color: #333;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }
    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
      background: #f8fafc;
      font-family: inherit;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    .form-group textarea {
      resize: vertical;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .radio-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .radio-label:hover {
      background: #f1f5f9;
    }
    .radio-label input[type="radio"] {
      margin-right: 10px;
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .checkbox-label {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .checkbox-label input[type="checkbox"] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .error-message {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 4px;
      display: none;
    }
    .error-message.show {
      display: block;
    }
    .submit-btn {
      width: 100%;
      background: #667eea;
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .submit-btn:hover:not(:disabled) {
      background: #5a67d8;
    }
    .submit-btn:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }
    .form-status {
      margin-top: 12px;
      font-size: 14px;
      text-align: center;
      display: none;
      padding: 10px;
      border-radius: 6px;
    }
    .form-status.success {
      background: #dcfce7;
      color: #166534;
    }
    .required {
      color: #e53e3e;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  // ===== HTML =====
  const overlayHTML = `
    <div id="popupContactOverlay">
      <div class="popup-content">
        <button id="popupCloseBtn" aria-label="閉じる">&times;</button>
        <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; text-align: center;">お問い合わせ</h3>
        <form id="popupContactForm" novalidate>
          <div class="form-group">
            <label for="popupName">お名前 <span class="required">(必須)</span></label>
            <input type="text" id="popupName" name="name" required placeholder="山田 太郎">
            <p class="error-message" id="nameErrorMsg"></p>
          </div>
          <div class="form-group">
            <label for="popupEmail">メールアドレス <span class="required">(必須)</span></label>
            <input type="email" id="popupEmail" name="email" required placeholder="example@domain.com" autocomplete="email">
            <p class="error-message" id="emailErrorMsg"></p>
          </div>
          <div class="form-group">
            <label>お問い合わせ種別 <span class="required">(必須)</span></label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="inquiryType" value="SMARTDECK について" required>
                <span>SMARTDECK について</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="inquiryType" value="SMARTDECK キット販売について" required>
                <span>SMARTDECK キット販売について</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="inquiryType" value="AI Parking について" required>
                <span>AI Parking について</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="inquiryType" value="その他" required>
                <span>その他</span>
              </label>
            </div>
            <p class="error-message" id="inquiryTypeErrorMsg"></p>
          </div>
          <div class="form-group">
            <label for="popupMessage">お問い合わせ内容 <span class="required">(必須)</span></label>
            <textarea id="popupMessage" name="message" required rows="5" placeholder="ご用件をご記入ください"></textarea>
            <p class="error-message" id="messageErrorMsg"></p>
          </div>
          <div class="form-group" style="text-align: center; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #666; margin-bottom: 8px;">プライバシーポリシーに同意する</p>
            <label class="checkbox-label">
              <input type="checkbox" id="popupPrivacy" name="privacy" required>
              <span>同意する</span>
            </label>
            <p class="error-message" id="privacyErrorMsg"></p>
          </div>
          <button type="submit" class="submit-btn" id="popupSubmitBtn">送信</button>
          <p class="form-status" id="formStatus"></p>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', overlayHTML);

  // ===== JS =====
  const icon = document.getElementById('popupContactTrigger');
  const overlay = document.getElementById('popupContactOverlay');
  const closeBtn = document.getElementById('popupCloseBtn');
  const form = document.getElementById('popupContactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('popupSubmitBtn');
  const nameInput = document.getElementById('popupName');
  const emailInput = document.getElementById('popupEmail');
  const messageInput = document.getElementById('popupMessage');
  const privacyCheckbox = document.getElementById('popupPrivacy');
  const nameError = document.getElementById('nameErrorMsg');
  const emailError = document.getElementById('emailErrorMsg');
  const inquiryTypeError = document.getElementById('inquiryTypeErrorMsg');
  const messageError = document.getElementById('messageErrorMsg');
  const privacyError = document.getElementById('privacyErrorMsg');
  const inquiryTypeRadios = document.querySelectorAll('input[name="inquiryType"]');

  function openPopup() {
    overlay.classList.add('active');
    setTimeout(() => nameInput.focus(), 200);
  }

  function closePopup() {
    overlay.classList.remove('active');
    setTimeout(() => {
      form.reset();
      clearAllErrors();
      formStatus.style.display = 'none';
      formStatus.className = 'form-status';
    }, 200);
  }

  function clearAllErrors() {
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    inquiryTypeError.style.display = 'none';
    messageError.style.display = 'none';
    privacyError.style.display = 'none';
  }

  if (icon) icon.addEventListener('click', openPopup);
  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closePopup();
  });

  function validateEmail(email) {
    if (!email || email.trim() === '') return 'メールアドレスを入力してください';
    const parts = email.split('@');
    if (parts.length !== 2) return '「@」は1つだけにしてください';
    const [local, domain] = parts;
    if (!local || local.trim() === '') return '「@」の前にユーザー名を入力してください';
    if (!domain || domain.trim() === '') return '「@」の後にドメインを入力してください';
    if (!domain.includes('.')) return 'ドメインに「.」を含めてください（例: example.com）';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return '正しいメールアドレス形式で入力してください';
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('@gmam.com') || lowerEmail.includes('@gmai.com')) {
      return '「@gmail.com」の間違いではありませんか？';
    }
    if (lowerEmail.includes('@yahoo.co.com') || lowerEmail.includes('@yahoo.co.j')) {
      return '「@yahoo.co.jp」の間違いではありませんか？';
    }
    return null;
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim()) nameError.style.display = 'none';
    formStatus.style.display = 'none';
  });
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim()) emailError.style.display = 'none';
    formStatus.style.display = 'none';
  });
  emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim()) {
      const err = validateEmail(emailInput.value.trim());
      if (err) {
        emailError.textContent = err;
        emailError.style.display = 'block';
        emailError.className = 'error-message show';
      }
    }
  });
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim()) messageError.style.display = 'none';
    formStatus.style.display = 'none';
  });
  inquiryTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      inquiryTypeError.style.display = 'none';
      formStatus.style.display = 'none';
    });
  });
  privacyCheckbox.addEventListener('change', () => {
    if (privacyCheckbox.checked) privacyError.style.display = 'none';
    formStatus.style.display = 'none';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearAllErrors();
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';
    let hasError = false;

    const name = nameInput.value.trim();
    if (!name) {
      nameError.textContent = 'お名前を入力してください';
      nameError.style.display = 'block';
      nameError.className = 'error-message show';
      hasError = true;
    }
    const email = emailInput.value.trim();
    const emailErr = validateEmail(email);
    if (emailErr) {
      emailError.textContent = emailErr;
      emailError.style.display = 'block';
      emailError.className = 'error-message show';
      hasError = true;
    }
    const selectedType = document.querySelector('input[name="inquiryType"]:checked');
    if (!selectedType) {
      inquiryTypeError.textContent = 'お問い合わせ種別を選択してください';
      inquiryTypeError.style.display = 'block';
      inquiryTypeError.className = 'error-message show';
      hasError = true;
    }
    const message = messageInput.value.trim();
    if (!message) {
      messageError.textContent = 'お問い合わせ内容を入力してください';
      messageError.style.display = 'block';
      messageError.className = 'error-message show';
      hasError = true;
    }
    if (!privacyCheckbox.checked) {
      privacyError.textContent = 'プライバシーポリシーに同意してください';
      privacyError.style.display = 'block';
      privacyError.className = 'error-message show';
      hasError = true;
    }
    if (hasError) {
      const firstError = form.querySelector('.error-message.show');
      if (firstError) {
        const input = firstError.previousElementSibling || firstError.parentElement.querySelector('input, textarea');
        if (input) input.focus();
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    // ※ Formspree の Form ID
    const FORMSPREE_ID = 'xqegrpvd';

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        inquiryType: selectedType.value,
        message: message,
        _subject: '【お問い合わせ】' + selectedType.value + '｜' + name + ' 様'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          formStatus.textContent = '✅ お問い合わせを送信しました。担当者よりご連絡いたします。';
          formStatus.className = 'form-status success';
          formStatus.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.textContent = '送信';
          setTimeout(() => { closePopup(); }, 3000);
        } else {
          throw new Error(data.error || '送信に失敗しました');
        }
      })
      .catch(() => {
        formStatus.textContent = '⚠️ 送信に失敗しました。時間をおいて再度お試しください。';
        formStatus.className = 'form-status';
        formStatus.style.display = 'block';
        formStatus.style.background = '#fee2e2';
        formStatus.style.color = '#991b1b';
        submitBtn.disabled = false;
        submitBtn.textContent = '送信';
      });
  });
})();
