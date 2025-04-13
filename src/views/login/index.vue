<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { reqLogin } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const LoginForm = ref({
    username: 'admin',
    password: '111111'
})
const loading = ref(false)
const LoginFormRef = ref()
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        {min:6, max:16, message:'长度必须是6-16位', trigger:'blur'}
    ]
}

const handleLogin = async () => {
    loading.value = true
    const form = LoginFormRef.value
    form.validate(async (valid:any) => {
        if (valid) {
            try {
                let res:any = await reqLogin(LoginForm.value)
                userStore.setToken(res.data)
                ElMessage.success('登录成功')
                router.replace('/')
            } catch (error:any) {
                ElMessage.error(error)
            }
            finally {
                loading.value = false
            }
        } else {
            console.log('表单校验不通过')
            return false
        }
    })
}
</script>    

<template>
    <div class="container">
        <div class="login-box">
            <el-row>
                <el-col :span="12" :xs="0"></el-col>
                <el-col :span="12" :xs="24">
                    <el-form ref="LoginFormRef" style="max-width: 600px" :model="LoginForm" :rules="rules"
                        label-width="auto" class="loginForm">
                        <h1>Hello</h1>
                        <h3>欢迎来到硅谷甄选</h3>
                        <el-form-item label="用户名" prop="username" class="login-label">
                            <el-input :prefix-icon="User" v-model="LoginForm.username" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password" class="login-label">
                            <el-input :prefix-icon="Lock" type="password" v-model="LoginForm.password"
                                show-password></el-input>
                        </el-form-item>
                        <el-form-item >
                            <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
    color: #fff !important
}

.container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat center / cover;

    .loginForm {
        position: relative;
        width: 80%;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        padding: 40px;

        h1 {
            color: #fff;
            font-size: 40px;
        }

        h3 {
            color: #fff;
            font-size: 20px;
            font-weight: lighter;
            margin: 20px 0;
        }

        .login-btn{
            width: 100%;
            margin-left: 7vh;
        }
    }
}
</style>