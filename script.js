const form = document.getElementById('contactForm');
const resultMessage = document.getElementById('resultMessage');
const submitButton = form.querySelector('.submit-button');
const defaultSubmitMarkup = submitButton.innerHTML;
const faqToggleBtn = document.getElementById('faqToggleBtn');
const faqPanel = document.getElementById('faqPanel');
const serviceField = document.getElementById('service');
const deviceContainer = document.getElementById('deviceSelectionContainer');
const deviceLabel = document.getElementById('deviceLabel');
const learningDeviceField = document.getElementById('learningDevice');

const showToast = (message, variant = 'success') => {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${variant}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>${message}</span>`;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
};

const disableMobileZoom = () => {
  if (!window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  let lastTouchEnd = 0;

  const preventGestureZoom = (event) => {
    event.preventDefault();
  };

  document.addEventListener('gesturestart', preventGestureZoom, { passive: false });
  document.addEventListener('gesturechange', preventGestureZoom, { passive: false });
  document.addEventListener('gestureend', preventGestureZoom, { passive: false });

  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );
};

disableMobileZoom();

const serviceDisplayName = {
  'graphic-design': 'creative graphic designing',
  'web-development': 'web development'
};

const configureDeviceField = () => {
  const selectedService = serviceField.value;
  const hasService = selectedService !== '';
  const options = learningDeviceField.querySelectorAll('option[data-category]');

  deviceContainer.hidden = !hasService;
  learningDeviceField.required = hasService;

  options.forEach((option) => {
    const isMatchingCategory = option.dataset.category === selectedService;
    const shouldHide = hasService && !isMatchingCategory;
    option.hidden = shouldHide;
    option.disabled = shouldHide;
  });

  if (!hasService) {
    deviceLabel.textContent = 'Learning Device & Setup *';
  } else if (selectedService === 'graphic-design') {
    deviceLabel.textContent = 'Preferred Learning Device *';
  } else {
    deviceLabel.textContent = 'Do You Have a Laptop? *';
  }

  const selectedOption = learningDeviceField.selectedOptions[0];
  const isSelectedOptionValid =
    selectedOption && (!selectedOption.dataset.category || selectedOption.dataset.category === selectedService);

  if (!isSelectedOptionValid) {
    learningDeviceField.value = '';
  }

  syncFloatingState(learningDeviceField);
};

const syncFloatingState = (input) => {
  const formField = input.closest('.form-field');
  if (!formField) {
    return;
  }
  const hasValue = input.value.trim() !== '';
  formField.classList.toggle('has-value', hasValue);
};

const validateInput = (input) => {
  const formField = input.closest('.form-field');
  const errorMessage = formField.querySelector('.error-message');
  errorMessage.textContent = '';
  formField.classList.remove('has-error', 'is-valid');

  if (!input.checkValidity()) {
    if (input.validity.valueMissing) {
      errorMessage.textContent = 'This field is required.';
    } else if (input.validity.typeMismatch) {
      errorMessage.textContent = input.type === 'email' ? 'Please enter a valid email address.' : 'Please enter a valid value.';
    } else if (input.validity.patternMismatch) {
      errorMessage.textContent = input.id === 'phone' ? 'Phone should be 7-15 digits (numbers, spaces, dashes).' : 'Please use the correct format.';
    }
    formField.classList.add('has-error');
    return false;
  }

  if (input.value.trim() !== '') {
    formField.classList.add('is-valid');
  }
  return true;
};

const validateForm = () => {
  const fields = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('email'),
    document.getElementById('phone'),
    document.getElementById('service'),
    learningDeviceField,
  ];

  return fields.reduce((isValid, input) => validateInput(input) && isValid, true);
};

const setSubmittingState = (isSubmitting) => {
  if (isSubmitting) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>Submitting...';
    return;
  }
  submitButton.disabled = false;
  submitButton.innerHTML = defaultSubmitMarkup;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setSubmittingState(true);
  resultMessage.textContent = '';
  resultMessage.classList.remove('success');

  if (!validateForm()) {
    setSubmittingState(false);
    resultMessage.textContent = 'Please fix the highlighted fields and try again.';
    return;
  }

  const formData = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    others: form.others.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    service: form.service.value,
    learningDevice: learningDeviceField.value,
  };

  try {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Submission failed');
    }

    resultMessage.textContent = `Thank you, ${formData.firstName}! Your ${serviceDisplayName[formData.service]} request has been submitted.`;
    resultMessage.classList.add('success');
    showToast('Form submitted successfully!');

    const successParams = new URLSearchParams({
      firstName: formData.firstName,
      service: serviceDisplayName[formData.service]
    });

    form.reset();
    configureDeviceField();
    setTimeout(() => {
      window.location.href = `success.html?${successParams.toString()}`;
    }, 900);
  } catch (error) {
    console.error('Submission error:', error);
    const message = error.message || 'Submission failed';
    resultMessage.textContent = `${message}. Please try again.`;
  } finally {
    setSubmittingState(false);
  }
});

const inputs = form.querySelectorAll('input, select');
inputs.forEach((input) => {
  syncFloatingState(input);
  input.addEventListener('input', () => {
    syncFloatingState(input);
    validateInput(input);
    resultMessage.textContent = '';
    resultMessage.classList.remove('success');
  });
  input.addEventListener('blur', () => {
    syncFloatingState(input);
    validateInput(input);
  });
  input.addEventListener('change', () => syncFloatingState(input));
});

serviceField.addEventListener('change', () => {
  configureDeviceField();
  validateInput(learningDeviceField);
});

configureDeviceField();

if (faqToggleBtn && faqPanel) {
  faqToggleBtn.addEventListener('click', () => {
    const isOpen = !faqPanel.hidden;
    faqPanel.hidden = isOpen;
    faqToggleBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', (event) => {
    if (faqPanel.hidden) {
      return;
    }
    const clickedInsideFaq = faqPanel.contains(event.target) || faqToggleBtn.contains(event.target);
    if (!clickedInsideFaq) {
      faqPanel.hidden = true;
      faqToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !faqPanel.hidden) {
      faqPanel.hidden = true;
      faqToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}
