const roleContent = {
  admin: {
    label: 'الآدمن',
    cards: [
      ['⚙', 'إعدادات المؤشرات', 'تعريف المؤشرات وأشكال العرض وتفعيلها لكل مجال.', 'إعداد النظام', 'is-disabled'],
      ['▦', 'إدارة المستخدمين', 'إضافة المستخدمين وربطهم بالشركة والمجال والصلاحية.', 'إدارة الحسابات', 'is-disabled'],
      ['◫', 'لوحة مؤشرات الأداء', 'معاينة لوحات المجالات ومتابعة جاهزية البيانات.', 'فتح اللوحة', 'is-disabled']
    ]
  },
  manager: {
    label: 'مدير الإدارة',
    cards: [
      ['✎', 'إدخال البيانات الشهرية', 'إدخال قياسات المجال ومراجعة الأشهر المتاحة للتعديل.', 'فتح شاشة الإدخال', 'is-disabled'],
      ['◫', 'لوحة مجال الإدارة', 'متابعة المؤشرات والنتائج الخاصة بمجالك.', 'فتح لوحة المجال', 'is-disabled'],
      ['✓', 'حالة استكمال البيانات', 'معرفة المؤشرات التي اكتمل إدخالها وما يزال بانتظار الاستكمال.', 'عرض الحالة', 'is-disabled']
    ]
  },
  executive: {
    label: 'الرئيس التنفيذي',
    cards: [
      ['◫', 'الملخص التنفيذي', 'متابعة أداء الشركة والمجالات من شاشة واحدة.', 'فتح الملخص', 'is-disabled'],
      ['▤', 'عرض المجالات', 'الانتقال بين لوحات المجالات ومراجعة نتائجها.', 'استعراض اللوحات', 'is-disabled'],
      ['▣', 'شاشة العرض', 'عرض المؤشرات بالتتابع على شاشة الإدارة العليا.', 'معاينة العرض', 'is-disabled']
    ]
  }
};

function renderRole(role) {
  const view = roleContent[role];
  const grid = document.getElementById('workspaceCards');
  const roleLabel = document.getElementById('roleLabel');
  if (!view || !grid) return;
  roleLabel.textContent = view.label;
  grid.replaceChildren(...view.cards.map(([icon, title, description, action, state]) => {
    const card = document.createElement('article');
    card.className = 'workspace-card';
    const top = document.createElement('div');
    top.className = 'card-top';
    const iconNode = document.createElement('span');
    iconNode.className = 'card-icon';
    iconNode.setAttribute('aria-hidden', 'true');
    iconNode.textContent = icon;
    const tag = document.createElement('span');
    tag.className = 'card-tag';
    tag.textContent = 'قريباً';
    top.append(iconNode, tag);
    const heading = document.createElement('h3');
    heading.textContent = title;
    const copy = document.createElement('p');
    copy.textContent = description;
    const footer = document.createElement('div');
    footer.className = 'card-action ' + state;
    footer.append(document.createTextNode(action), document.createTextNode('←'));
    card.append(top, heading, copy, footer);
    return card;
  }));
}
window.renderRole = renderRole;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach(node => {
    node.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('.role-tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('is-active'));
      button.classList.add('is-active');
      renderRole(button.dataset.role);
    });
  });
  if (new URLSearchParams(window.location.search).get('mode') === 'preview') {
    document.body.classList.add('preview-mode');
    renderRole('admin');
  }

  const menuButton = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuButton && mainNav) menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    document.querySelector('.site-header').classList.toggle('nav-open', !expanded);
  });

  const form = document.getElementById('loginForm');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const message = document.getElementById('loginMessage');
    message.textContent = 'هذه واجهة معاينة؛ تسجيل الدخول الفعلي سيُفعّل بعد ربط حسابات المستخدمين وصلاحياتهم.';
    message.hidden = false;
  });
});
