<script>
import { ref, reactive } from "vue";
import api from "@/api/Api";
import { useRouter } from "vue-router";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants/constants";
import { ElButton, ElForm, ElFormItem, ElInput } from "element-plus";
  
export default {
    setup() {
        const loginFormRef = ref(null);
        const loginForm = reactive({
        username: "",
        password: "",
        });
        const loading = ref(false);
        const router = useRouter();

        // Validation rules
        const rules = reactive({
            username: [{ required: true, message: "Please input your username", trigger: "blur" }],
            password: [{ required: true, message: "Please input the password", trigger: "blur" },],
        });

        // Submit form function
        const submitForm = (formEl) => {
        if (!formEl) return;
        formEl.validate(async (valid) => {
            if (valid) {
            loading.value = true;
            try {
                const res = await api.post("/api/token/", {
                username: loginForm.username,
                password: loginForm.password,
                });
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                router.push("/");
            } catch (error) {
                alert("Login failed! Please check your credentials.");
            } finally {
                loading.value = false;
            }
            } else {
            console.log("error submit!");
            }
        });
        };

        return {
        loginFormRef,
        loginForm,
        rules,
        submitForm,
        loading,
        };
    },
};
</script>
  
<template>
    <ElForm
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="auto"
      class="form-container"
    >
      <ElFormItem label="Username" prop="username">
        <ElInput v-model="loginForm.username" placeholder="Enter your email" />
      </ElFormItem>
      <ElFormItem label="Password" prop="password">
        <ElInput
          v-model="loginForm.password"
          type="password"
          autocomplete="off"
          placeholder="Enter your password"
        />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" :loading="loading" @click="submitForm(loginFormRef)">
          Login
        </ElButton>
      </ElFormItem>
    </ElForm>
</template>
  

  
<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.form-input {
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-button {
  width: 95%;
  padding: 10px;
  margin: 20px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.form-button:hover {
  background-color: #0056b3;
}
</style>
  