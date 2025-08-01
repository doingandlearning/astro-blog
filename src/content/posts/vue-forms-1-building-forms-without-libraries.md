---
title: "Vue Forms #1: Building Forms without Libraries"
description: "Master forms in Vue.js without external libraries. Learn Vue form basics, data binding with v-model, and validation methods using only native Vue techniques."
date: "2024-04-09"
updateDate: ""
tags: ["vue", "forms", "validation", "tutorial", "javascript"]
draft: true
youtubeId: "v0S5_ne6aZM"
---

# Vue Forms #1: Building Forms without Libraries

> This blog post accompanies the YouTube video: [Watch on YouTube](https://www.youtube.com/watch?v=v0S5_ne6aZM)

Forms are a fundamental part of web applications, and Vue.js provides excellent built-in support for handling forms without needing external libraries. In this first part of our Vue forms series, we'll explore how to build robust forms using only native Vue features.

## Overview

This tutorial covers the fundamentals of form handling in Vue.js, focusing on:

- Basic form setup and data binding
- Two-way data binding with v-model
- Form validation without libraries
- Handling different input types

## Setting Up a Basic Form

Let's start with a simple contact form:

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name">Name:</label>
      <input 
        id="name"
        v-model="form.name"
        type="text"
        required
      />
    </div>
    
    <div>
      <label for="email">Email:</label>
      <input 
        id="email"
        v-model="form.email"
        type="email"
        required
      />
    </div>
    
    <div>
      <label for="message">Message:</label>
      <textarea 
        id="message"
        v-model="form.message"
        required
      ></textarea>
    </div>
    
    <button type="submit">Send Message</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      console.log('Form submitted:', this.form);
    }
  }
};
</script>
```

## Understanding v-model

The `v-model` directive creates two-way data binding between form inputs and component data:

```vue
<!-- These are equivalent: -->
<input v-model="form.name" />

<input 
  :value="form.name"
  @input="form.name = $event.target.value"
/>
```

### v-model with Different Input Types

#### Checkboxes

```vue
<template>
  <!-- Single checkbox -->
  <input 
    v-model="form.newsletter"
    type="checkbox"
    id="newsletter"
  />
  <label for="newsletter">Subscribe to newsletter</label>
  
  <!-- Multiple checkboxes -->
  <div>
    <input v-model="form.interests" value="coding" type="checkbox" id="coding" />
    <label for="coding">Coding</label>
    
    <input v-model="form.interests" value="design" type="checkbox" id="design" />
    <label for="design">Design</label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        newsletter: false,
        interests: [] // Array for multiple checkboxes
      }
    };
  }
};
</script>
```

#### Radio Buttons

```vue
<template>
  <div>
    <input v-model="form.experience" value="beginner" type="radio" id="beginner" />
    <label for="beginner">Beginner</label>
    
    <input v-model="form.experience" value="intermediate" type="radio" id="intermediate" />
    <label for="intermediate">Intermediate</label>
    
    <input v-model="form.experience" value="expert" type="radio" id="expert" />
    <label for="expert">Expert</label>
  </div>
</template>
```

#### Select Dropdowns

```vue
<template>
  <!-- Single select -->
  <select v-model="form.country">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </select>
  
  <!-- Multiple select -->
  <select v-model="form.skills" multiple>
    <option value="javascript">JavaScript</option>
    <option value="vue">Vue.js</option>
    <option value="react">React</option>
  </select>
</template>
```

## Form Validation Without Libraries

### Basic Validation with Computed Properties

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input 
        v-model="form.email"
        type="email"
        :class="{ 'error': !isEmailValid && form.email }"
      />
      <span v-if="!isEmailValid && form.email" class="error-message">
        Please enter a valid email
      </span>
    </div>
    
    <button :disabled="!isFormValid" type="submit">
      Submit
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      }
    };
  },
  computed: {
    isEmailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return this.form.email === '' || emailRegex.test(this.form.email);
    },
    isFormValid() {
      return this.form.name && 
             this.form.email && 
             this.isEmailValid && 
             this.form.message;
    }
  }
};
</script>
```

### Custom Validation Methods

```vue
<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {}
    };
  },
  methods: {
    validateField(field) {
      this.errors = { ...this.errors };
      
      switch (field) {
        case 'name':
          if (!this.form.name) {
            this.errors.name = 'Name is required';
          } else if (this.form.name.length < 2) {
            this.errors.name = 'Name must be at least 2 characters';
          } else {
            delete this.errors.name;
          }
          break;
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.form.email) {
            this.errors.email = 'Email is required';
          } else if (!emailRegex.test(this.form.email)) {
            this.errors.email = 'Please enter a valid email';
          } else {
            delete this.errors.email;
          }
          break;
          
        case 'confirmPassword':
          if (this.form.password !== this.form.confirmPassword) {
            this.errors.confirmPassword = 'Passwords do not match';
          } else {
            delete this.errors.confirmPassword;
          }
          break;
      }
    },
    
    handleSubmit() {
      // Validate all fields
      Object.keys(this.form).forEach(field => {
        this.validateField(field);
      });
      
      // Check if form is valid
      if (Object.keys(this.errors).length === 0) {
        console.log('Form is valid:', this.form);
      }
    }
  }
};
</script>
```

### Real-time Validation

```vue
<template>
  <input 
    v-model="form.email"
    @blur="validateField('email')"
    @input="clearError('email')"
    type="email"
  />
</template>

<script>
export default {
  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
        this.errors = { ...this.errors };
      }
    }
  }
};
</script>
```

## Form Modifiers

Vue provides useful modifiers for v-model:

```vue
<!-- .lazy - sync after change events instead of input -->
<input v-model.lazy="form.name" />

<!-- .number - typecast to number -->
<input v-model.number="form.age" type="number" />

<!-- .trim - trim whitespace -->
<input v-model.trim="form.message" />
```

## Best Practices

1. **Use semantic HTML**: Proper labels, fieldsets, and form structure
2. **Validate on both client and server**: Client validation is for UX, server validation is for security
3. **Provide clear error messages**: Tell users exactly what's wrong and how to fix it
4. **Handle loading states**: Show feedback during form submission
5. **Consider accessibility**: Use proper ARIA labels and keyboard navigation

## Next Steps

In the next part of this series, we'll explore:
- Advanced validation patterns
- Custom form components
- Form composition and reusability
- Integration with Vue 3's Composition API

## Additional Resources

- [Watch the video on YouTube](https://www.youtube.com/watch?v=v0S5_ne6aZM)
- [Vue.js Form Input Bindings](https://vuejs.org/guide/essentials/forms.html)
- [Vue.js Form Validation Guide](https://vuejs.org/guide/essentials/forms.html#form-validation)

---

*This post is part of my YouTube tutorial series. Subscribe to [my channel](https://www.youtube.com/channel/UCtzNXx0YjJFvAuAPL9ZjQOw) for more tutorials!*