/**
* Ozz Core JS
* v1.0
*/

class Ozz {
  
  /**
  * Ozz Form Repeater Fields
  */
  initRepeaterFields() {
    
  }
  
  /**
  * Form Field Validator
  * @param {*} field
  * @param {*} rules
  */
  validate( field, rules ) {
    // Write Validation logics here
    console.log(field);
    console.log(rules);
  }
  
  /**
  * Initialize validator by data attribute
  */
  initValidator() {
    const input_fields = document.querySelectorAll('[data-ozz-validate]');
    input_fields.forEach((field, i) => {
      const rules = field.getAttribute('data-ozz-validate');
      field.addEventListener('change', () => {
        this.validate(field, rules);
      });
    });
  }
}


// Initialize
(function() {
  const ozz = new Ozz();
  ozz.initValidator();
  ozz.initRepeaterFields();
})();