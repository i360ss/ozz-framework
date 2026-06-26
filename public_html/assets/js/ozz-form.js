(() => {

    /**
     * Toggle Class
     * @param object DOM
     * @param string className
     */
    function toggleClass(DOM, className) {
        DOM.classList.contains(className) ? DOM.classList.remove(className) : DOM.classList.add(className);
    }

    /**
     * Random string
     * @param int length
     */
    function randomString(length = 5) {
        return Array.from({ length }, () => Math.random().toString(36)[2]).join('');
    }

    /**
    * Ozz Form Repeater initialization
    * @param DOM Used Block
    * @param bindEvent Event for bind with newly added item
    */
    function initRepeater(DOM = false, bindEvent = false) {
        repeater__Accordion(DOM);
        repeater__addItem(DOM, bindEvent);
        repeater__deleteItem(DOM);
    }

    /**
     * Repeater field Accordion
     */
    function repeater__Accordion(repeater = false) {
        const accordionHeads = repeater ? repeater.querySelectorAll('.ozz-fm__repeat-head') : document.querySelectorAll('.ozz-fm__repeat-head');
        accordionHeads.forEach(thisHead => {
            const
                thisHeadParent = thisHead.closest('.ozz-fm__repeat-fields'),
                accordionBody = thisHeadParent.querySelector('.ozz-fm__repeat-body');

            if (thisHead) {
                thisHead.addEventListener('click', (e) => {
                    if (e.target.classList.contains('ozz-fm__repeat-remove')) {
                        return;
                    }

                    toggleClass(accordionBody, 'close');
                    toggleClass(thisHead, 'close');
                })
            }

            // Update repeater title when field input
            const thisRepeater = thisHead.closest('.ozz-fm__repeat-fields');
            const firstField = thisRepeater.querySelector('input[type="text"], input[type="email"], textarea, select');
            if (firstField && thisHead.querySelector('.ozz-fm__repeat-title')) {
                firstField.addEventListener('input', (e) => {
                    thisHead.querySelector('.ozz-fm__repeat-title').textContent = e.target.value;
                });
            }
        });
    }

    /**
     * Add Repeater Item
     */
    function repeater__addItem(DOM, bindEvents = false) {
        const addItemTrigger = DOM ? DOM.querySelectorAll('.ozz-fm__repeat-add') : document.querySelectorAll('.ozz-fm__repeat-add');
        addItemTrigger.forEach(addTrigger => {
            addTrigger.addEventListener('click', (e) => {
                const
                    thisRepeater = e.target.closest('.ozz-fm__repeat'),
                    thisWrapper = thisRepeater.querySelector(':scope > .ozz-fm__repeat-wrapper'),
                    thisItemCount = thisWrapper.querySelectorAll(':scope > .ozz-fm__repeat-fields'),
                    thisItem = thisWrapper.querySelector(':scope > .ozz-fm__repeat-fields'),
                    newItem = thisItem.cloneNode(true),
                    maxRepeates = thisRepeater.getAttribute( 'data-ozz-repeat-max' ) ?? false;

                if (maxRepeates && thisItemCount.length >= maxRepeates) {
                    addTrigger.setAttribute('disabled', true);
                    return false;
                }
                addTrigger.removeAttribute('disabled', true);

                // Add ID to new item
                newItem.setAttribute('id', `rptf-${randomString(18)}`);

                // Clear values and modify repeater item
                const itemFields = newItem.querySelectorAll('input, textarea, button, progress, meter, select, datalist, [data-ozz-wyg]');
                itemFields.forEach(elm => {
                    if (elm.tagName === 'INPUT' || elm.tagName === 'TEXTAREA') {
                        elm.value = '';
                    } else if (elm.tagName === 'SELECT') {
                        elm.selectedIndex = 0;
                    }

                    if (thisRepeater.classList.contains('single') === false) {
                        itemFields.forEach(elm => {
                            if (elm.name) {
                                const newName = elm.name.replace(/__\d+__(?=[^__]*$)/, `__${thisItemCount.length}__`);
                                elm.name = newName;
                            } else if (elm.dataset.fieldName) {
                                const newDataAttr = elm.dataset.fieldName.replace(/__\d+__(?=[^__]*$)/, `__${thisItemCount.length}__`);
                                elm.setAttribute('data-field-name', newDataAttr);
                            }
                        });
                    }

                    // Enable delete button if disabled
                    [thisItem, newItem].forEach(element => {
                        element.querySelector('.ozz-fm__repeat-remove').removeAttribute('disabled');
                    });
                });

                // Clear selected media files
                newItem.querySelectorAll('.ozz-fm__media-embed-wrapper').forEach(mediaWrapper => {
                    mediaWrapper.innerHTML = '';
                });

                newItem.querySelector('.ozz-fm__repeat-number').innerHTML = thisItemCount.length + 1;
                const titleEl = newItem.querySelector('.ozz-fm__repeat-title');
                if (titleEl) titleEl.innerHTML = '';
                newItem.querySelector('.ozz-fm__repeat-head')?.classList.remove('close');
                newItem.querySelector('.ozz-fm__repeat-body')?.classList.remove('close');

                // Init for child repeaters of clone
                repeater__addItem(newItem, bindEvents);
                repeater__deleteItem(newItem);

                // Init accordion
                repeater__Accordion(newItem);

                // Append new item
                thisWrapper.appendChild(newItem);

                // Update Names
                repeater__renameFields();

                // bind events for new item
                if (typeof bindEvents === 'function') {
                    bindEvents();
                }
            });
        });
    }

    /**
     * Delete repeater Item
     */
    function repeater__deleteItem(DOM) {
        const deleteItemTrigger = DOM ? DOM.querySelectorAll('.ozz-fm__repeat-remove') : document.querySelectorAll('.ozz-fm__repeat-remove');
        deleteItemTrigger.forEach(deleteItem => {
            deleteItem.addEventListener('click', (e) => {
                e.preventDefault();
                // Delete Item
                const
                    thisFieldsetWrapper = deleteItem.closest('.ozz-fm__repeat-wrapper'),
                    thisFields = thisFieldsetWrapper?.querySelectorAll(':scope > .ozz-fm__repeat-fields');

                if (thisFields && thisFields.length > 1) {
                    deleteItem.closest('.ozz-fm__repeat-fields').remove();
                    repeater__renameFields();
                } else {
                    deleteItem.setAttribute('disabled', true);
                    return false;
                }
            });
        });
    }

    /**
     * Reset field name indexes of repeater
     */
    function repeater__renameFields(specificFieldSet = false) {
        const allWrappers = specificFieldSet !== false ? specificFieldSet : document.querySelectorAll('.ozz-fm__repeat-wrapper');
        allWrappers.forEach((wrapper) => {
            const
                thisRepeater = wrapper.closest('.ozz-fm__repeat'),
                thisFieldSet = wrapper.querySelectorAll(':scope > .ozz-fm__repeat-fields'),
                isSingle = thisRepeater.classList.contains('single'),
                rptName = thisRepeater.getAttribute('data-rpt'),
                rptNameParts = rptName.split('__'),
                rptNameOnly = rptNameParts[rptNameParts.length - 1];

            thisFieldSet.forEach((fieldSet, i) => {
                if (fieldSet) {
                    const itemIndex = !isSingle
                        ? fieldSet.querySelector(':scope > .ozz-fm__repeat-head .ozz-fm__repeat-number')
                        : fieldSet.querySelector(':scope > .ozz-fm__repeat-number');

                    if (itemIndex) {
                        itemIndex.innerHTML = i + 1;
                    }

                    if (isSingle === false) {
                        // Rename field names
                        const itemFields = fieldSet.querySelectorAll('input, textarea, button, progress, meter, select, datalist, [data-ozz-wyg]');
                        itemFields.forEach(elm => {
                            if (elm.name) {
                                const newName = elm.name.replace(new RegExp(`${rptNameOnly}__\\d+__`), `${rptNameOnly}__${i}__`);
                                elm.name = newName;
                            } else if (elm.dataset.fieldName) {
                                const newDataAttr = elm.dataset.fieldName.replace(new RegExp(`${rptNameOnly}__\\d+__`), `${rptNameOnly}__${i}__`);
                                elm.setAttribute('data-field-name', newDataAttr);
                            }
                        });
                    }
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initRepeater());
})();