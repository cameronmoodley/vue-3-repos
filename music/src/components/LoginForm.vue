<template>
    <div v-if="loginShowAlert" class="text-white text-center font-bold p-4 mb-4" :class="loginAlertVariant">
        {{ loginAlertMessage }}
    </div>
    <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
        <label class="inline-block mb-2">Email</label>
        <vee-field
type="email"
                    name="email"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Enter Email" />
    <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
        <label class="inline-block mb-2">Password</label>
        <vee-field
type="password"
                    name="password"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Password" />
        <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
type="submit"
            :disabled="loginInSubmission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
            hover:bg-purple-700">
        Submit
    </button>
    </vee-form>
</template>
<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:3|max:32',
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: 'bg-blue-500',
      loginAlertMessage: 'Please wait we are logging you in',
    };
  },
  methods: {
    async login(values) {
      this.loginInSubmission = true;
      this.loginShowAlert = true;
      this.loginAlertVariant = 'bg-blue-500';
      this.loginAlertMessage = 'Please wait we are logging you in';

      try {
        await this.$store.dispatch('login', values);
      } catch (error) {
        this.loginAlertVariant = 'bg-red-500';
        this.loginAlertMessage = 'Invalid details';
        this.loginInSubmission = false;
        return;
      }

      this.loginAlertVariant = 'bg-green-500';
      this.loginAlertMessage = 'User logged in';
      window.location.reload();
    },
  },
};
</script>
<style lang="">
</style>
