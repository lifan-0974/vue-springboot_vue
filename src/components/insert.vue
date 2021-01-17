<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item v-if="false" label="图书序号" >
      <el-input v-model="ruleForm.pid"></el-input>
    </el-form-item>
    <el-form-item label="请假类型" prop="ltitle">
      <el-select v-model="ruleForm.ltitle" placeholder="请选择请假类型">
        <el-option label="事假" value="事假"></el-option>
        <el-option label="病假" value="病假"></el-option>
        <el-option label="产假" value="产假"></el-option>
        <el-option label="陪产假" value="陪产假"></el-option>
        <el-option label="长假" value="长假"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属部门" prop="branch">
      <el-select v-model="ruleForm.branch" placeholder="所属部门">
        <el-option label="开发部" value="开发部"></el-option>
        <el-option label="实施部" value="实施部"></el-option>
        <el-option label="测试部" value="测试部"></el-option>
        <el-option label="运营部" value="运营部"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="起始时间" required>
      <el-col :span="11">
        <el-form-item prop="lnewtime">
          <el-date-picker type="date" placeholder="请假起始时间" v-model="ruleForm.lnewtime" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="结束时间" required>
      <el-col :span="11">
        <el-form-item prop="loidtime">
          <el-date-picker type="date" placeholder="请假结束时间" v-model="ruleForm.loidtime" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="请假原因" prop="cause">
      <el-input  v-model="ruleForm.cause"></el-input>
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交假条</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        ruleForm: {
          lid: '',
          ltitle: '',
          lnewtime: '',
          loidtime: '',
          cause: '',
          branch: ''
        },
        rules: {
          lnewtime: [
            {  required: true, message: '请选择日期', trigger: 'change' }
          ],
          loidtime: [
            {  required: true, message: '请选择时间', trigger: 'change' }
          ],
          cause: [
            { required: true, message: '请输入请假原因', trigger: 'change' }
          ]

        }
      };
    },
    methods: {
      submitForm(formName) {

        const _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {

            axios.post('http://localhost:8001/add',this.ruleForm).then(function (resp) {
              if (resp.data.success == true) {
                _this.$message('添加成功!')
                _this.$router.push(
                  {
                    path: '/LeaverAll',
                    query: {
                      pid: _this.$route.query.pid
                    }
                  })
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    created() {
     this.ruleForm.pid=this.$route.query.pid
    }
  }
</script>
