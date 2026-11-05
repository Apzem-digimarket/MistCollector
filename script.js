const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

function setMenu(open) {
  mainNav.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
}

menuToggle.addEventListener('click', () => setMenu(!mainNav.classList.contains('is-open')));
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

const searchInput = document.getElementById('siteSearch');
const searchStatus = document.getElementById('searchStatus');
let searchTimer;

function showSearchStatus(message) {
  searchStatus.textContent = message;
  clearTimeout(searchTimer);
  if (message) searchTimer = setTimeout(() => { searchStatus.textContent = ''; }, 4000);
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (query.length < 2) {
    showSearchStatus('Enter at least 2 characters to search.');
    return;
  }
  const target = [...document.querySelectorAll('main section')].find((section) => section.textContent.toLowerCase().includes(query));
  if (target) {
    showSearchStatus('');
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    showSearchStatus('No match found. Showing mist collection solutions.');
    document.getElementById('solutions').scrollIntoView({ behavior: 'smooth' });
  }
});

const enquiryForm = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');
const details = document.getElementById('f-details');
const detailsCount = document.getElementById('count-details');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;
const NAME_PATTERN = /^[\p{L}][\p{L}\p{M}\s.'’-]*$/u;

const validators = {
  name(value) {
    if (!value) return 'Enter your name.';
    if (value.length < 2) return 'Name must be at least 2 characters.';
    if (!NAME_PATTERN.test(value)) return 'Name can only contain letters, spaces, and . \' -';
    return '';
  },
  contact(value) {
    if (!value) return 'Enter a phone number or email address.';
    if (value.includes('@')) return EMAIL_PATTERN.test(value) ? '' : 'Enter a valid email address, like name@company.com.';
    const digits = value.replace(/\D/g, '');
    if (!PHONE_PATTERN.test(value) || digits.length < 8 || digits.length > 15) return 'Enter a valid phone number (8–15 digits) or an email address.';
    return '';
  },
  details(value) {
    if (!value) return 'Describe the machine, process, or mist source.';
    if (value.length < 10) return 'Add a little more detail (at least 10 characters).';
    return '';
  },
};

function validateField(input) {
  const message = validators[input.name](input.value.trim());
  input.setAttribute('aria-invalid', String(Boolean(message)));
  document.getElementById(`err-${input.name}`).textContent = message;
  return !message;
}

const fields = [...enquiryForm.querySelectorAll('input, textarea')];
fields.forEach((input) => {
  input.addEventListener('blur', () => { if (input.value.trim() || input.getAttribute('aria-invalid')) validateField(input); });
  input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
});

details.addEventListener('input', () => { detailsCount.textContent = `${details.value.length} / ${details.maxLength}`; });

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formSuccess.textContent = '';
  const results = fields.map(validateField);
  if (results.includes(false)) {
    fields[results.indexOf(false)].focus();
    return;
  }
  const form = new FormData(enquiryForm);
  const clean = (key) => String(form.get(key)).trim();
  const subject = encodeURIComponent('Mist collection enquiry');
  const body = encodeURIComponent(`Name: ${clean('name')}\nContact: ${clean('contact')}\n\nApplication details:\n${clean('details')}`);
  formSuccess.textContent = 'Your email app is opening with the enquiry details. If nothing opens, email sales@apzem.com directly.';
  window.location.href = `mailto:sales@apzem.com?subject=${subject}&body=${body}`;
});
