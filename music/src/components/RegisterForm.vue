<template lang="">
  <div
    v-if="registrationShowAlert"
    class="text-white text-center font-bold p-5 mb-4"
    :class="registrationAlertVariant"
  >
    {{ registrationAlertMessage }}
  </div>
  <vee-form :validation-schema="schema" :initial-values="userData" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field v-slot="{ field, errors }" name="password" :bails="false">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          type="password"
          v-bind="field"
        />
        <div v-for="(error, index) in errors" :key="index" class="text-red-600">
          {{ error }}
        </div>
      </vee-field>
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirmPassword"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirmPassword" />
    </div>
    <!-- User Type -->
    <div class="mb-3">
      <label class="inline-block mb-2">User Type</label>
      <vee-field
        as="select"
        name="userType"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Listener">Listener</option>
        <option value="Artist">Artist</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="userType" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      :disabled="registrationInSubmission"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>
<script>
export default {
  name: "RegisterForm",
  data() {
    return {
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:3|max:32",
        confirmPassword: "passwords_mismatch:@password",
        country: "required|excluded:Antarctica",
        userType: "required",
        tos: "tos",
      },
      userData: {
        country: "USA",
        userType: "Listener",
      },
      registrationInSubmission: false,
      registrationShowAlert: false,
      registrationAlertVariant: "bg-blue-50",
      registrationAlertMessage: "Please wait your account is being created",
    };
  },
  methods: {
    async register(values) {
      this.registrationInSubmission = true;
      this.registrationShowAlert = true;
      this.registrationAlertVariant = "bg-blue-500";
      this.registrationAlertMessage = "Please wait your account is being created";

      try {
        await this.$store.dispatch("register", values);
      } catch (error) {
        this.registrationInSubmission = false;
        this.registrationAlertVariant = "bg-red-500";
        this.registrationAlertMessage = "An expected error occured please try again later";
        return;
      }

      this.registrationAlertVariant = "bg-green-500";
      this.registrationAlertMessage = "Account Created";
      window.location.reload();
    },
  },
};
</script>
<style lang=""></style>
