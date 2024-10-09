<script>
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';
import { ref, reactive } from 'vue';
import api from '@/api/Api';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const ruleFormRef = ref(null);
    const loading = ref(false);
    const router = useRouter();

    const regForm = reactive({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      pass: "",
      checkPass: "",
    });

    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        if (regForm.checkPass !== "") {
          if (!ruleFormRef.value) return;
          ruleFormRef.value.validateField("checkPass");
        }
        callback();
      }
    };

    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== regForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };

    const rules = reactive({
        pass: [{ validator: validatePass, required: true, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, required: true, trigger: "blur" }],
        firstName: [{ required: true, message: "Please input your first name", trigger: "blur" }],
        lastName: [{ required: true, message: "Please input your last name", trigger: "blur" }],
        username: [{ required: true, message: "Please input your username", trigger: "blur" }],
        email: [
        { required: true, message: "Please input your email", trigger: "blur" },
        { type: "email", message: "Please input a valid email", trigger: "blur" },
        ],
    });

    const submitForm = async (formEl) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const res = await api.post("/api/user/register/", {
                    first_name: regForm.firstName,
                    last_name: regForm.lastName,
                    username: regForm.username,
                    email: regForm.email,
                    password: regForm.pass,
                });
                router.push("/login")
                alert("Registration successful! Please log in.");
            } catch (error) {
                console.log("Error response:", error.response?.data); // Log the actual error message
                alert("Error: " + (error.response?.data || error.message));
            } finally {
                loading.value = false;
            }
        } else {
          console.log("error submit!");
        }
      });
    };

    return {
      ruleFormRef,
      regForm,
      rules,
      submitForm,
      loading,
    };
  },
};


</script>

<template>
    <ElForm
        ref="ruleFormRef"
        :model="regForm"
        :rules="rules"
        label-width="auto"
        class="form-container"
    >
        <ElFormItem label="First Name" prop="firstName">
            <ElInput v-model="regForm.firstName" />
        </ElFormItem>
        <ElFormItem label="Last Name" prop="lastName">
            <ElInput v-model="regForm.lastName" />
        </ElFormItem>
        <ElFormItem label="Username" prop="username">
            <ElInput v-model="regForm.username" />
        </ElFormItem>
        <ElFormItem label="Email" prop="email">
            <ElInput v-model="regForm.email" />
        </ElFormItem>
        <ElFormItem label="Password" prop="pass">
            <ElInput v-model="regForm.pass" type="password" autocomplete="off"/>
        </ElFormItem>
        <ElFormItem label="Verify Password" prop="checkPass">
            <ElInput v-model="regForm.checkPass" type="password" autocomplete="off" />
        </ElFormItem>
        <ElFormItem>
            <ElButton type="primary" :loading="loading" @click="submitForm(ruleFormRef)">
                Register
            </ElButton>
        </ElFormItem>
    </ElForm>
</template>

<style>
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