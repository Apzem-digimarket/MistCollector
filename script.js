const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Close' : 'Menu';
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menu';
  });
});

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = document.getElementById('siteSearch').value.trim().toLowerCase();
  if (!query) return;
  const target = [...document.querySelectorAll('main section')].find((section) => section.textContent.toLowerCase().includes(query));
  (target || document.getElementById('solutions')).scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('enquiryForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = encodeURIComponent('Mist collection enquiry');
  const body = encodeURIComponent(`Name: ${form.get('name')}\nContact: ${form.get('contact')}\n\nApplication details:\n${form.get('details') || 'Not provided'}`);
  document.getElementById('formSuccess').textContent = 'Your email app is opening with the enquiry details.';
  window.location.href = `mailto:sales@apzem.com?subject=${subject}&body=${body}`;
});
