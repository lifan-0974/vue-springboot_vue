<template>
<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item v-if="false" label="图书序号" >
    <el-input v-model="ruleForm.lid"></el-input>
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
  <el-form-item label="审批人" prop="approver">
    <el-input  v-model="ruleForm.approver"></el-input>
  </el-form-item>
  <el-form-item label="是否同意" prop="unify">
    <el-radio-group v-model="ruleForm.unify">
      <el-radio label="1">符合申请</el-radio>
      <el-radio  label="0">未符合申请</el-radio>
    </el-radio-group>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">审核</el-button>
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
          approver: '',
          unify: ''
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
          ],
          approver: [
            { required: true, message: '请输入审批人员姓名', trigger: 'change' }
          ]

        }
      };
    },
    methods: {
      submitForm(formName) {
        const _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {

            axios.post('http://localhost:8001/update',this.ruleForm).then(function (resp) {
              if (resp.data.message == '审核成功') {
                _this.$message('审核成功!')
                _this.$router.push('/LeaverAll')
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
      const _this = this
      axios.post('http://localhost:8001/findOne?lid='+this.$route.query.lid+'').then(function (resp) {
        _this.ruleForm = resp.data.data.findone
        if (resp.data.data.findone.unify==1){
          _this.ruleForm.unify='1'
        } else {
          _this.ruleForm.unify='0'
        }

      })
    }
  }
</script>
