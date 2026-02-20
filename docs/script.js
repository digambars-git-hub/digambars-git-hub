function getAccordionSections(root) {
    return Array.from(root.querySelectorAll(':scope > section.section, :scope > section.section1, :scope > section.section2'));
}

function ensureSectionContent(section) {
    if (section.querySelector(':scope > .section-content')) return;

    const title = section.querySelector(':scope > .section-title');
    if (!title) return;

    const divider = section.querySelector(':scope > .divider');
    const content = document.createElement('div');
    content.className = 'section-content';

    Array.from(section.children).forEach((child) => {
        if (child === title || child === divider) return;
        content.appendChild(child);
    });

    if (divider) {
        divider.insertAdjacentElement('afterend', content);
    } else {
        title.insertAdjacentElement('afterend', content);
    }
}

function setActive(sections, activeEl) {
    sections.forEach((el) => {
        const isActive = el === activeEl;
        el.classList.toggle('is-active', isActive);
        el.classList.toggle('is-dim', !isActive);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.left-column, .right-column');

    columns.forEach((col) => {
        const sections = getAccordionSections(col);
        if (sections.length === 0) return;

        sections.forEach((section) => {
            ensureSectionContent(section);
            section.setAttribute('tabindex', '0');

            section.addEventListener('mouseenter', () => setActive(sections, section));
            section.addEventListener('focusin', () => setActive(sections, section));

            section.addEventListener('click', (e) => {
                const target = e.target;
                if (target && target.closest && target.closest('a')) return;
                setActive(sections, section);
            });

            section.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(sections, section);
                }
            });
        });

        // Keep the first panel open by default for stronger first impression.
        setActive(sections, sections[0]);
        col.addEventListener('mouseleave', () => setActive(sections, sections[0]));
    });
});
