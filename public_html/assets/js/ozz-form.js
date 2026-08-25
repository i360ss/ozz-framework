// Ozz Form
(function (window, document) {
    'use strict';

    if (window.OzzForm) return; // guard against double-inclusion

    /* =====================================================================
     * Utilities
     * =================================================================== */
    const Utils = {
        toggleClass(el, className) {
            if (!el) return;
            el.classList.toggle(className);
        },

        randomString(length = 5) {
            let str = '';
            while (str.length < length) {
                str += Math.random().toString(36).slice(2);
            }
            return str.slice(0, length);
        },

        escapeHTML(str) {
            return String(str).replace(/[&<>'"]/g, (tag) => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
            }[tag] || tag));
        },

        dispatch(el, name, detail = {}) {
            el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
        }
    };

    /** Centralized selectors */
    const SEL = {
        repeat: '.ozz-fm__repeat',
        repeatWrapper: '.ozz-fm__repeat-wrapper',
        repeatFields: '.ozz-fm__repeat-fields',
        repeatHead: '.ozz-fm__repeat-head',
        repeatBody: '.ozz-fm__repeat-body',
        repeatAdd: '.ozz-fm__repeat-add',
        repeatRemove: '.ozz-fm__repeat-remove',
        repeatNumber: '.ozz-fm__repeat-number',
        repeatTitle: '.ozz-fm__repeat-title',
        mediaEmbedWrapper: '.ozz-fm__media-embed-wrapper',

        filter: '[data-ozz-filter]',
        filterTextfield: '[data-ozz-filter-textfield]',
        filterHiddenfield: '[data-ozz-filter-hiddenfield]',
        filterDropdown: '[data-ozz-filter-dropdown]',
        filterTagsContainer: '.ozz-tags-container',

        fileField: '[data-ozz-file]',
        filePreviewItem: '.ozz-preview-item',
        fileRemoveBtn: '.ozz-remove-btn',

        conditionField: '[data-condition]',
        namableFields: 'input, textarea, button, progress, meter, select, datalist, [data-ozz-wyg]',
        titleSourceFields: 'input[type="text"], input[type="email"], textarea, select'
    };

    /* =====================================================================
     * Repeater module
     * =================================================================== */
    const Repeater = {
        /** Repeaters have no per-element hydration step — global listeners cover everything. */
        init() {},

        /**
         * Re-derive item numbers and (for non-single repeaters) field names/
         * data-field-name attributes for every row in scope.
         * @param {Element} [scopeWrapper] Limit to this wrapper's subtree; omit to rescan the whole document.
         */
        renameFields(scopeWrapper) {
            const wrappers = scopeWrapper
                ? [scopeWrapper, ...scopeWrapper.querySelectorAll(SEL.repeatWrapper)]
                : Array.from(document.querySelectorAll(SEL.repeatWrapper));

            wrappers.forEach((wrapper) => this._renameWrapper(wrapper));
        },

        _renameWrapper(wrapper) {
            const repeaterEl = wrapper.closest(SEL.repeat);
            if (!repeaterEl) return;

            const fieldSets = wrapper.querySelectorAll(`:scope > ${SEL.repeatFields}`);
            const isSingle = repeaterEl.classList.contains('single');
            const rptName = repeaterEl.getAttribute('data-rpt') || '';
            const rptNameParts = rptName.split('__');
            const rptNameOnly = rptNameParts[rptNameParts.length - 1];
            const pattern = rptNameOnly ? new RegExp(`${rptNameOnly}__\\d+__`) : null;

            fieldSets.forEach((fieldSet, i) => {
                const numberEl = !isSingle
                    ? fieldSet.querySelector(`:scope > ${SEL.repeatHead} ${SEL.repeatNumber}`)
                    : fieldSet.querySelector(`:scope > ${SEL.repeatNumber}`);
                if (numberEl) numberEl.textContent = String(i + 1);

                if (!isSingle && pattern) {
                    fieldSet.querySelectorAll(SEL.namableFields).forEach((elm) => {
                        if (elm.name) {
                            const newName = elm.name.replace(pattern, `${rptNameOnly}__${i}__`);
                            if (newName !== elm.name) {
                                elm.name = newName;
                                if (elm.type === 'file' && elm.nextElementSibling?.dataset.ozzEmbed !== undefined) {
                                    elm.nextElementSibling.setAttribute('data-ozz-embed', newName);
                                }
                            }
                        } else if (elm.dataset.fieldName) {
                            elm.setAttribute('data-field-name', elm.dataset.fieldName.replace(pattern, `${rptNameOnly}__${i}__`));
                        }
                    });
                }
            });

            Utils.dispatch(repeaterEl, 'ozzRepeater:reindex', { repeater: repeaterEl, total: fieldSets.length });
        },

        addItem(trigger) {
            const repeaterEl = trigger.closest(SEL.repeat);
            if (!repeaterEl) return;

            const wrapper = repeaterEl.querySelector(`:scope > ${SEL.repeatWrapper}`);
            const items = wrapper ? wrapper.querySelectorAll(`:scope > ${SEL.repeatFields}`) : [];
            const templateItem = items[0];
            if (!wrapper || !templateItem) return;

            // Mirrors the original's exact semantics: attribute absent → no limit;
            // attribute present (including "0") → numeric cap, so max="0" blocks immediately.
            const maxAttr = repeaterEl.getAttribute('data-ozz-repeat-max');
            const hasMax = maxAttr !== null && maxAttr !== '';
            const maxRepeat = hasMax ? Number(maxAttr) : Infinity;
            if (hasMax && items.length >= maxRepeat) {
                trigger.setAttribute('disabled', 'true');
                return;
            }
            trigger.removeAttribute('disabled');

            const newItem = templateItem.cloneNode(true);
            newItem.id = `rptf-${Utils.randomString(18)}`;
            this._resetClone(newItem, items.length);

            wrapper.appendChild(newItem);
            this.renameFields(wrapper);

            // Re-enable every delete button in this repeater now that there's
            // more than one row (a lone row's delete button may have been
            // disabled previously).
            wrapper.querySelectorAll(`:scope > ${SEL.repeatFields} ${SEL.repeatRemove}`).forEach((btn) => {
                btn.removeAttribute('disabled');
            });

            Utils.dispatch(repeaterEl, 'ozzRepeater:add', {
                item: newItem,
                repeater: repeaterEl,
                index: items.length
            });
        },

        /** Strip every trace of the source row's state out of a freshly cloned item. */
        _resetClone(newItem, newIndex) {
            newItem.querySelectorAll(SEL.namableFields).forEach((elm) => {
                if (elm.tagName === 'INPUT' || elm.tagName === 'TEXTAREA') {
                    elm.value = '';
                } else if (elm.tagName === 'SELECT') {
                    elm.selectedIndex = 0;
                }
                elm.removeAttribute('data-ozz-condition-inited');
                delete elm.dataset.ozzFilterInited;
                elm.removeAttribute('data-file-value'); // don't carry over the source row's existing-files
            });

            // Force full re-hydration of filters/conditions on the clone.
            newItem.querySelectorAll(SEL.filter).forEach((f) => delete f.dataset.ozzFilterInited);
            newItem.querySelectorAll(SEL.conditionField).forEach((f) => delete f.dataset.ozzConditionInited);

            // Clear leftover visual selection state from cloned filter dropdowns/tags.
            newItem.querySelectorAll(SEL.filterTagsContainer).forEach((tc) => { tc.innerHTML = ''; });
            newItem.querySelectorAll(`${SEL.filterDropdown} li`).forEach((li) => {
                li.classList.remove('selected');
                li.style.display = '';
            });
            newItem.querySelectorAll(SEL.filterDropdown).forEach((dd) => dd.classList.add('hidden'));

            newItem.querySelector(SEL.repeatRemove)?.removeAttribute('disabled');
            newItem.querySelectorAll(SEL.mediaEmbedWrapper).forEach((mw) => { mw.innerHTML = ''; });

            const numberEl = newItem.querySelector(SEL.repeatNumber);
            if (numberEl) numberEl.textContent = String(newIndex + 1);

            const titleEl = newItem.querySelector(SEL.repeatTitle);
            if (titleEl) titleEl.textContent = '';

            newItem.querySelector(SEL.repeatHead)?.classList.remove('close');
            newItem.querySelector(SEL.repeatBody)?.classList.remove('close');
        },

        deleteItem(trigger) {
            const wrapper = trigger.closest(SEL.repeatWrapper);
            const items = wrapper ? wrapper.querySelectorAll(`:scope > ${SEL.repeatFields}`) : null;

            if (!items || items.length <= 1) {
                trigger.setAttribute('disabled', 'true');
                return;
            }

            const repeaterEl = wrapper.closest(SEL.repeat);
            trigger.closest(SEL.repeatFields)?.remove();
            this.renameFields(wrapper);

            if (repeaterEl) {
                Utils.dispatch(repeaterEl, 'ozzRepeater:delete', {
                    repeater: repeaterEl,
                    remainingCount: wrapper.querySelectorAll(`:scope > ${SEL.repeatFields}`).length
                });
            }
        }
    };

    /* =====================================================================
     * Filter dropdown module
     * =================================================================== */
    const filterState = new WeakMap();

    const Filter = {
        init(scope = document) {
            const fields = scope.matches?.(SEL.filter) ? [scope] : Array.from(scope.querySelectorAll(SEL.filter));
            fields.forEach((field) => this._hydrate(field));
        },

        _hydrate(field) {
            if (field.dataset.ozzFilterInited === 'true') return;
            field.dataset.ozzFilterInited = 'true';

            const searchField = field.querySelector(SEL.filterTextfield);
            const hiddenField = field.querySelector(SEL.filterHiddenfield);
            const dropdown = field.querySelector(SEL.filterDropdown);
            if (!searchField || !hiddenField || !dropdown) return;

            const allowCustom = field.getAttribute('data-ozz-filter-allow-custom') === 'true';
            const isMultiple = field.getAttribute('data-ozz-filter-multiple') === 'true';

            const state = { selectedItems: [], allowCustom, isMultiple, searchField, hiddenField, dropdown, tagsContainer: null };
            filterState.set(field, state);

            if (isMultiple) {
                searchField.placeholder = searchField.placeholder || 'Select options...';

                let tagsContainer = field.querySelector(SEL.filterTagsContainer);
                if (!tagsContainer) {
                    tagsContainer = document.createElement('div');
                    tagsContainer.className = 'ozz-tags-container';
                    searchField.parentNode.insertBefore(tagsContainer, searchField);
                }
                state.tagsContainer = tagsContainer;

                this._syncSelectionFromHidden(field);
            } else if (hiddenField.value) {
                const options = dropdown.getElementsByTagName('li');
                const matched = Array.from(options).find((o) => o.getAttribute('data-value') === hiddenField.value);
                if (matched) {
                    searchField.value = matched.textContent.trim();

                    // Update repeater title if this filter field is first item inside a repeater
                    const repeater = searchField.closest(SEL.repeatFields) ?? false;
                    if (repeater && repeater.querySelector(SEL.titleSourceFields) === searchField) {
                        repeater.querySelector(SEL.repeatTitle).textContent = matched.textContent.trim();
                    }
                } else if (allowCustom) {
                    searchField.value = hiddenField.value;
                }
            }

            // Public per-field API used by Conditional's `changeOptions` action.
            field.updateOptions = (newOptions, preserveSelection = false) =>
                this.updateOptions(field, newOptions, preserveSelection);
        },

        /**
         * Re-derive `selectedItems`/tags/checked <li>s from the hidden field's
         * current value against whatever <li>s currently exist in the dropdown.
         * Called both at hydration time and after `updateOptions` swaps in a
         * new option list with `preserveSelection: true` — this is what makes
         * selection survive a dynamic option-list change (e.g. changing the
         * parent "brand" field re-populates "model" options, but a previously
         * chosen model that's still valid should stay selected/tagged).
         */
        _syncSelectionFromHidden(field) {
            const state = filterState.get(field);
            if (!state || !state.hiddenField.value) return;

            const options = state.dropdown.getElementsByTagName('li');
            const values = state.hiddenField.value.split(',').filter(Boolean);

            state.selectedItems = [];
            Array.from(options).forEach((opt) => {
                if (values.includes(opt.getAttribute('data-value'))) {
                    opt.classList.add('selected');
                    state.selectedItems.push({ value: opt.getAttribute('data-value'), text: opt.textContent.trim() });
                } else {
                    opt.classList.remove('selected');
                }
            });

            state.searchField.value = '';
            if (state.tagsContainer) this.renderTags(field);
        },

        renderTags(field) {
            const state = filterState.get(field);
            if (!state?.tagsContainer) return;

            state.tagsContainer.innerHTML = '';
            state.selectedItems.forEach((item) => {
                const tag = document.createElement('span');
                tag.className = 'ozz-tag';
                tag.innerHTML = `${Utils.escapeHTML(item.text)} <button type="button" class="btn remove-tag-btn" data-val="${Utils.escapeHTML(item.value)}">&times;</button>`;
                tag.querySelector('button').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleSelection(field, item.value, item.text);
                });
                state.tagsContainer.appendChild(tag);
            });
        },

        toggleSelection(field, value, text) {
            const state = filterState.get(field);
            if (!state) return;

            const options = state.dropdown.getElementsByTagName('li');
            const idx = state.selectedItems.findIndex((i) => i.value === value);

            if (idx === -1) {
                state.selectedItems.push({ value, text });
                Array.from(options).find((o) => o.getAttribute('data-value') === value)?.classList.add('selected');
            } else {
                state.selectedItems.splice(idx, 1);
                Array.from(options).find((o) => o.getAttribute('data-value') === value)?.classList.remove('selected');
            }

            this._setHiddenValue(state.hiddenField, state.selectedItems.map((i) => i.value).join(','));
            this.renderTags(field);
        },

        _setHiddenValue(hiddenField, value) {
            if (hiddenField.value === value) return;
            hiddenField.value = value;
            hiddenField.dispatchEvent(new Event('change', { bubbles: true }));
            Utils.dispatch(hiddenField, 'ozzFilter:change', { value });
        },

        _resetOptionFilter(dropdown) {
            Array.from(dropdown.getElementsByTagName('li')).forEach((o) => { o.style.display = ''; });
        },

        _onSearchInput(searchField) {
            const field = searchField.closest(SEL.filter);
            const state = filterState.get(field);
            if (!state) return;

            const filterText = searchField.value.toLowerCase();

            if (state.allowCustom && !state.isMultiple) {
                this._setHiddenValue(state.hiddenField, searchField.value);
            }

            Array.from(state.dropdown.getElementsByTagName('li')).forEach((opt) => {
                opt.style.display = opt.textContent.toLowerCase().includes(filterText) ? '' : 'none';
            });
        },

        _onOptionClick(li) {
            const dropdown = li.closest(SEL.filterDropdown);
            const field = dropdown.closest(SEL.filter);
            const state = filterState.get(field);
            if (!state) return;

            const value = li.getAttribute('data-value');
            const text = li.textContent.trim();

            if (state.isMultiple) {
                this.toggleSelection(field, value, text);
                state.searchField.value = '';
                state.searchField.focus();
                this._resetOptionFilter(dropdown);
            } else {
                state.searchField.value = text;
                this._setHiddenValue(state.hiddenField, value);
                dropdown.classList.add('hidden');
            }
        },

        _onSearchBlur(searchField, relatedTarget) {
            const field = searchField.closest(SEL.filter);
            const state = filterState.get(field);
            if (!state) return;
            if (relatedTarget && state.dropdown.contains(relatedTarget)) return;
            this._settle(field);
        },

        /** Validate/normalize whatever's currently typed, then close the dropdown. */
        _settle(field) {
            const state = filterState.get(field);
            if (!state) return;
            const { searchField, dropdown, hiddenField, allowCustom, isMultiple } = state;

            if (isMultiple) {
                const value = searchField.value.trim();
                if (value !== '') {
                    if (allowCustom) {
                        this.toggleSelection(field, value, value);
                    } else {
                        const matched = Array.from(dropdown.getElementsByTagName('li')).find(
                            (o) => o.textContent.trim().toLowerCase() === value.toLowerCase()
                        );
                        if (matched) this.toggleSelection(field, matched.getAttribute('data-value'), matched.textContent.trim());
                    }
                    searchField.value = '';
                    this._resetOptionFilter(dropdown);
                }
                dropdown.classList.add('hidden');
            } else {
                if (!allowCustom) {
                    const matched = Array.from(dropdown.getElementsByTagName('li')).find(
                        (o) => o.textContent.trim().toLowerCase() === searchField.value.trim().toLowerCase()
                    );
                    if (matched) {
                        searchField.value = matched.textContent.trim();
                        this._setHiddenValue(hiddenField, matched.getAttribute('data-value'));
                    } else if (searchField.value !== '') {
                        searchField.value = '';
                        this._setHiddenValue(hiddenField, '');
                    }
                }
                dropdown.classList.add('hidden');
            }
        },

        _handleOutsideInteraction(e) {
            const activeField = e.target.closest(SEL.filter);
            document.querySelectorAll(SEL.filter).forEach((field) => {
                const state = filterState.get(field);
                if (!state) return;

                if (field !== activeField) {
                    if (!state.dropdown.classList.contains('hidden')) this._settle(field);
                } else if (e.target === state.searchField) {
                    state.dropdown.classList.remove('hidden');
                }
            });
        },

        // Swap in a new option list
        updateOptions(field, newOptions, preserveSelection = false) {
            const state = filterState.get(field);
            if (!state) return;
            const { dropdown, hiddenField, searchField, isMultiple } = state;

            dropdown.innerHTML = '';
            newOptions.forEach((opt) => {
                const li = document.createElement('li');
                li.setAttribute('data-value', opt.value);
                li.textContent = opt.text;
                dropdown.appendChild(li);
            });

            if (!preserveSelection) {
                this._setHiddenValue(hiddenField, '');
                searchField.value = '';
                if (isMultiple) {
                    state.selectedItems = [];
                    if (state.tagsContainer) state.tagsContainer.innerHTML = '';
                }
                return;
            }

            if (!hiddenField.value) return;

            if (isMultiple) {
                this._syncSelectionFromHidden(field);
            } else {
                const matched = Array.from(dropdown.getElementsByTagName('li')).find(
                    (o) => o.getAttribute('data-value') === hiddenField.value
                );
                if (matched) searchField.value = matched.textContent.trim();
            }
        },

        getValue(field) {
            const state = filterState.get(field);
            if (!state) return null;
            if (!state.hiddenField.value) return state.isMultiple ? [] : '';
            return state.isMultiple ? state.hiddenField.value.split(',') : state.hiddenField.value;
        }
    };

    /* =====================================================================
     * Conditional rendering module
     * =================================================================== */
    const conditionCache = new WeakMap();

    const Conditional = {
        init(scope = document) {
            const fields = scope.matches?.(SEL.conditionField) ? [scope] : Array.from(scope.querySelectorAll(SEL.conditionField));
            fields.forEach((el) => this._hydrate(el));
        },

        _hydrate(targetEl) {
            if (targetEl.dataset.ozzConditionInited === 'true') return;
            targetEl.dataset.ozzConditionInited = 'true';

            let data;
            try {
                data = JSON.parse(targetEl.getAttribute('data-condition'));
            } catch (err) {
                console.error('Invalid JSON in data-condition on element:', targetEl, err);
                return;
            }
            if (!data) return;

            conditionCache.set(targetEl, data);
            this.evaluateAndApply(targetEl, data, true);
        },

        extractDependencies(conditionData) {
            let deps = [];
            if (conditionData.target) deps.push(conditionData.target);

            if (Array.isArray(conditionData.conditions?.rules)) {
                conditionData.conditions.rules.forEach((rule) => {
                    if (rule.target) deps.push(rule.target);
                    if (rule.field) deps.push(rule.field);
                    if (rule.conditions) deps = deps.concat(this.extractDependencies(rule));
                });
            }
            return [...new Set(deps)];
        },

        /** Scopes inside the same repeater row first, then falls back to a global lookup. */
        findSourceElements(key, targetEl) {
            const repeaterRow = targetEl.closest(SEL.repeatFields);

            if (repeaterRow && targetEl.name) {
                const lastIndex = targetEl.name.lastIndexOf('__');
                const base = lastIndex !== -1 ? targetEl.name.slice(0, lastIndex) : targetEl.name;
                const fieldName = `${base}__${key}`;
                const rowElements = repeaterRow.querySelectorAll(`[name="${fieldName}"], [data-field-name="${fieldName}"]`);
                if (rowElements.length > 0) return Array.from(rowElements);
            }

            return Array.from(document.querySelectorAll(`[name="${key}"], [data-field-name="${key}"]`));
        },

        getFieldValue(key, targetEl) {
            const sources = this.findSourceElements(key, targetEl);
            if (sources.length === 0) return null;
            const sourceEl = sources[0];

            const filterWrapper = sourceEl.closest(SEL.filter);
            if (filterWrapper) return Filter.getValue(filterWrapper);

            if (sourceEl.tagName === 'SELECT' && sourceEl.multiple) {
                return Array.from(sourceEl.selectedOptions).map((o) => o.value);
            }

            if (sourceEl.type === 'checkbox' || sourceEl.type === 'radio') {
                const checked = sources.filter((el) => el.checked);
                if (sourceEl.type === 'radio') return checked.length ? checked[0].value : '';
                return checked.map((el) => el.value);
            }

            return sourceEl.value;
        },

        evaluate(conditionData, targetEl) {
            if (Array.isArray(conditionData.conditions?.rules)) {
                const relation = (conditionData.conditions.relation || 'AND').toUpperCase();
                const results = conditionData.conditions.rules.map((rule) =>
                    rule.conditions ? this.evaluate({ conditions: rule }, targetEl) : this._evaluateSingleRule(rule, targetEl)
                );
                return relation === 'AND' ? results.every(Boolean) : results.some(Boolean);
            }
            return this._evaluateSingleRule(conditionData, targetEl);
        },

        _evaluateSingleRule(rule, targetEl) {
            const key = rule.target || rule.field;
            if (!key) return true;

            const actual = this.getFieldValue(key, targetEl);
            const op = rule.operator || rule.condition || 'equals';
            const expected = rule.value;

            switch (op) {
                case 'equals':
                case '==':
                    return actual == expected; // eslint-disable-line eqeqeq
                case 'not_equals':
                case '!=':
                    return actual != expected; // eslint-disable-line eqeqeq
                case 'contains':
                    return Array.isArray(actual)
                        ? actual.includes(expected)
                        : String(actual).toLowerCase().includes(String(expected).toLowerCase());
                case 'not_contains':
                    return Array.isArray(actual)
                        ? !actual.includes(expected)
                        : !String(actual).toLowerCase().includes(String(expected).toLowerCase());
                case 'not_empty':
                case 'filled':
                    return Array.isArray(actual)
                        ? actual.length > 0
                        : actual !== null && actual !== undefined && String(actual).trim() !== '';
                case 'is_empty':
                case 'blank':
                    return Array.isArray(actual)
                        ? actual.length === 0
                        : actual === null || actual === undefined || String(actual).trim() === '';
                case 'greater_than':
                case '>':
                    return Number(actual) > Number(expected);
                case 'less_than':
                case '<':
                    return Number(actual) < Number(expected);
                case 'greater_than_or_equal':
                case '>=':
                    return Number(actual) >= Number(expected);
                case 'less_than_or_equal':
                case '<=':
                    return Number(actual) <= Number(expected);
                default:
                    return true;
            }
        },

        _toggleInputs(container, disable) {
            container.querySelectorAll('input, select, textarea').forEach((input) => {
                if (disable) input.setAttribute('disabled', 'disabled');
                else input.removeAttribute('disabled');
            });
        },

        evaluateAndApply(targetEl, conditionData, initialRun = false) {
            const isMatched = this.evaluate(conditionData, targetEl);
            const action = conditionData.action || conditionData.condition;
            const wrapper = targetEl.closest('.ozz-fm__field') || targetEl;

            switch (action) {
                case 'changeOptions':
                case 'updateOptions': {
                    const sourceKey = conditionData.target || conditionData.conditions?.rules?.[0]?.field;
                    const parentValue = this.getFieldValue(sourceKey, targetEl);

                    let newOpts = [];
                    if (conditionData.options && parentValue && conditionData.options[parentValue]) {
                        const raw = conditionData.options[parentValue];
                        newOpts = Array.isArray(raw)
                            ? raw.map((v) => ({ value: v, text: v }))
                            : Object.entries(raw).map(([v, t]) => ({ value: v, text: t }));
                    }

                    const filterContainer = targetEl.matches(SEL.filter) ? targetEl : targetEl.closest(SEL.filter);
                    if (filterContainer) {
                        Filter.updateOptions(filterContainer, newOpts, initialRun);
                    } else if (targetEl.tagName === 'SELECT') {
                        targetEl.innerHTML = '';
                        newOpts.forEach((opt) => {
                            const optionEl = document.createElement('option');
                            optionEl.value = opt.value;
                            optionEl.textContent = opt.text;
                            targetEl.appendChild(optionEl);
                        });
                    }
                    break;
                }
                case 'show':
                    wrapper.style.display = isMatched ? '' : 'none';
                    this._toggleInputs(wrapper, !isMatched);
                    break;
                case 'hide':
                    wrapper.style.display = isMatched ? 'none' : '';
                    this._toggleInputs(wrapper, isMatched);
                    break;
                case 'enable':
                    targetEl.removeAttribute('disabled');
                    break;
                case 'disable':
                    if (isMatched) targetEl.setAttribute('disabled', 'disabled');
                    else targetEl.removeAttribute('disabled');
                    break;
            }
        },

        // Called on every bubbled input/change event
        _onSourceChange(changedEl) {
            document.querySelectorAll(SEL.conditionField).forEach((targetEl) => {
                const data = conditionCache.get(targetEl);
                if (!data) return;

                const deps = this.extractDependencies(data);
                for (const key of deps) {
                    if (this.findSourceElements(key, targetEl).includes(changedEl)) {
                        this.evaluateAndApply(targetEl, data);
                        break;
                    }
                }
            });
        }
    };

    /* =====================================================================
     * File upload live preview module
     * =================================================================== */
    const fileState = new WeakMap(); // field -> { embedDOM, targetId, accumulatedFiles, existingFiles, isInternalSync }
    const embedOwner = new WeakMap(); // embedDOM -> field

    const FileUpload = {
        init(scope = document) {
            const fields = scope.matches?.(SEL.fileField) ? [scope] : Array.from(scope.querySelectorAll(SEL.fileField));
            fields.forEach((field) => this._hydrate(field));
        },

        _hydrate(field) {
            if (fileState.has(field)) return;

            const targetId = field.name;
            const embedDOM = document.querySelector(`[data-ozz-embed="${CSS.escape(targetId)}"]`);
            if (!embedDOM) return;

            const state = { embedDOM, targetId, accumulatedFiles: [], existingFiles: [], isInternalSync: false };

            const initialData = field.getAttribute('data-file-value');
            if (initialData) {
                try {
                    const urls = JSON.parse(initialData);
                    state.existingFiles = urls.map((url) => ({
                        id: `existing-${Utils.randomString(9)}`,
                        url,
                        isExisting: true
                    }));
                } catch (err) {
                    console.error('Invalid JSON in data-file-value', err);
                }
            }

            fileState.set(field, state);
            embedOwner.set(embedDOM, field);
            this._render(field);
        },

        _onChange(field, event) {
            const state = fileState.get(field);
            if (!state) return;
            if (state.isInternalSync || event.detail?.ozzBypass) return;

            const incoming = Array.from(event.target.files);
            if (incoming.length === 0) return;

            const maxFiles = Number(field.getAttribute('data-ozz-max-files')) || Infinity;
            const tracked = incoming.map((file) => ({
                id: `${Date.now()}-${Utils.randomString(9)}`,
                file,
                isExisting: false
            }));

            const totalCurrent = state.accumulatedFiles.length + state.existingFiles.length;
            const slotsRemaining = maxFiles - totalCurrent;

            if (slotsRemaining <= 0) {
                alert(`Maximum limit of ${maxFiles} files reached.`);
                this._syncInput(field, state);
                return;
            }

            state.accumulatedFiles = state.accumulatedFiles.concat(tracked.slice(0, slotsRemaining));
            this._syncInput(field, state);
            this._render(field);
        },

        _syncInput(field, state) {
            state.isInternalSync = true;
            const dt = new DataTransfer();
            state.accumulatedFiles.forEach((t) => dt.items.add(t.file));
            field.files = dt.files;
            state.isInternalSync = false;
        },

        _render(field) {
            const state = fileState.get(field);
            if (!state) return;
            const { embedDOM } = state;

            embedDOM.querySelectorAll('img[data-ozz-blob]').forEach((img) => URL.revokeObjectURL(img.getAttribute('data-ozz-blob')));
            embedDOM.innerHTML = '';

            const allItems = [...state.existingFiles, ...state.accumulatedFiles];

            allItems.forEach((tracked) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'ozz-preview-item';
                wrapper.style.position = 'relative';
                wrapper.dataset.ozzItemId = tracked.id;
                wrapper.dataset.ozzExisting = String(!!tracked.isExisting);

                if (tracked.isExisting) {
                    const img = document.createElement('img');
                    img.src = tracked.url;
                    img.className = 'ozz-preview-img';
                    wrapper.appendChild(img);
                } else {
                    const file = tracked.file;
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        const objectUrl = URL.createObjectURL(file);
                        img.src = objectUrl;
                        img.alt = file.name;
                        img.className = 'ozz-preview-img';
                        img.setAttribute('data-ozz-blob', objectUrl);
                        wrapper.appendChild(img);
                    } else {
                        const card = document.createElement('div');
                        card.className = 'ozz-preview-file-card';
                        card.innerHTML = `
                            <span class="ozz-file-name">${Utils.escapeHTML(file.name)}</span>
                            <span class="ozz-file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        `;
                        wrapper.appendChild(card);
                    }
                }

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'ozz-remove-btn';
                removeBtn.innerHTML = '&times;';
                wrapper.appendChild(removeBtn);

                embedDOM.appendChild(wrapper);
            });
        },

        _onRemoveClick(itemWrapper) {
            const embedDOM = itemWrapper.closest('[data-ozz-embed]');
            const field = embedDOM && embedOwner.get(embedDOM);
            const state = field && fileState.get(field);
            if (!state) return;

            const id = itemWrapper.dataset.ozzItemId;
            const isExisting = itemWrapper.dataset.ozzExisting === 'true';

            if (isExisting) {
                const removed = state.existingFiles.find((i) => i.id === id);
                state.existingFiles = state.existingFiles.filter((i) => i.id !== id);
                if (removed) {
                    const deletedInput = document.createElement('input');
                    deletedInput.type = 'hidden';
                    deletedInput.name = `removed_${state.targetId}`;
                    deletedInput.value = removed.url;
                    state.embedDOM.parentElement.appendChild(deletedInput);
                }
            } else {
                state.accumulatedFiles = state.accumulatedFiles.filter((i) => i.id !== id);
                this._syncInput(field, state);
            }

            this._render(field);
            field.dispatchEvent(new CustomEvent('change', { detail: { ozzBypass: true } }));
        }
    };

    /* =====================================================================
     * Wiring: one-time hydration + global delegated listeners
     * =================================================================== */
    function initAll(scope = document) {
        Repeater.init(scope);
        Filter.init(scope);
        FileUpload.init(scope);
        Conditional.init(scope);
    }

    let listenersBound = false;
    function bindGlobalListeners() {
        if (listenersBound) return;
        listenersBound = true;

        document.addEventListener('click', (e) => {
            const removeFileBtn = e.target.closest(SEL.fileRemoveBtn);
            const addTrigger = !removeFileBtn && e.target.closest(SEL.repeatAdd);
            const removeTrigger = !removeFileBtn && !addTrigger && e.target.closest(SEL.repeatRemove);
            const head = !removeFileBtn && !addTrigger && !removeTrigger && e.target.closest(SEL.repeatHead);
            const dropdownOption = e.target.closest(`${SEL.filterDropdown} li`);

            if (removeFileBtn) {
                e.preventDefault();
                e.stopPropagation();
                const item = removeFileBtn.closest(SEL.filePreviewItem);
                if (item) FileUpload._onRemoveClick(item);
            } else if (addTrigger) {
                Repeater.addItem(addTrigger);
            } else if (removeTrigger) {
                e.preventDefault();
                Repeater.deleteItem(removeTrigger);
            } else if (head && !e.target.closest(SEL.repeatRemove)) {
                const fieldsEl = head.closest(SEL.repeatFields);
                const body = fieldsEl?.querySelector(`:scope > ${SEL.repeatBody}`);
                Utils.toggleClass(body, 'close');
                Utils.toggleClass(head, 'close');
            } else if (dropdownOption) {
                Filter._onOptionClick(dropdownOption);
            }

            // Always run last: settle any other open filter dropdowns.
            Filter._handleOutsideInteraction(e);
        });

        // Repeater accordion title sync (only from that row's first text-like field).
        const updateRepeaterLabel = (e) => {
            const fieldsEl = e.target.closest(SEL.repeatFields);
            if (fieldsEl) {
                const head = fieldsEl.querySelector(`:scope > ${SEL.repeatHead}`);
                const titleEl = head?.querySelector(SEL.repeatTitle);
                if (titleEl) {
                    const firstField = fieldsEl.querySelector(SEL.titleSourceFields);
                    const filterFldWrap = firstField.closest('[data-ozz-filter]');
                    const filterFld = filterFldWrap?.querySelector('[data-ozz-filter-hiddenfield]') ?? null;

                    if (firstField === e.target) {
                        titleEl.textContent = e.target.value;
                    } else if (filterFld === e.target) {
                        const valueTxt = filterFldWrap.querySelector(`li[data-value="${e.target.value}"]`);
                        titleEl.textContent = valueTxt.textContent;
                    }
                }
            }
        };

        document.addEventListener('input', (e) => {
            updateRepeaterLabel(e);
            if (e.target.matches?.(SEL.filterTextfield)) Filter._onSearchInput(e.target);
            Conditional._onSourceChange(e.target);
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches?.(SEL.fileField)) FileUpload._onChange(e.target, e);
            Conditional._onSourceChange(e.target);

            updateRepeaterLabel(e);
        });

        document.addEventListener('focusin', (e) => {
            if (e.target.matches?.(SEL.filterTextfield)) {
                const field = e.target.closest(SEL.filter);
                field?.querySelector(SEL.filterDropdown)?.classList.remove('hidden');
            }
            Filter._handleOutsideInteraction(e);
        });

        // `focusout` bubbles (unlike `blur`), so this one delegated listener
        // covers every filter search field, present and future.
        document.addEventListener('focusout', (e) => {
            if (e.target.matches?.(SEL.filterTextfield)) {
                Filter._onSearchBlur(e.target, e.relatedTarget);
            }
        });

        document.addEventListener('ozzRepeater:add', (e) => initAll(e.detail.item));
    }

    document.addEventListener('DOMContentLoaded', () => {
        bindGlobalListeners();
        initAll();
    });

    window.OzzForm = {
        init: initAll,
        Utils,
        Repeater,
        Filter,
        Conditional,
        FileUpload
    };
})(window, document);