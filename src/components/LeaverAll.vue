<template>
  <div>
    <el-badge value="hot" v-if="$route.query.pid!=null" class="item">
      <el-button v-if="$route.query.pid!=null" @click="insert()" size="small">写假条</el-button>
    </el-badge>
    <el-button size="small" type="primary" @click="batchDelete" :disabled="batchDeleteArr.length === 0">批量删除</el-button>
    <el-button size="small" type="primary" v-if="$route.query.pid==null "  @click="batchUpdate1" :disabled="batchDeleteArr.length === 0">全部审核</el-button>
    <el-button size="small" type="primary" v-if="$route.query.pid==null "  @click="batchUpdate2" :disabled="batchDeleteArr.length === 0">全部驳回</el-button>
    <el-table
      :data="tableData"
      :height="tableHeight"
      v-loading="tableLoading"
      border
      stripe
      size="mini"
      style="width: 100%"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection"  width="55" ></el-table-column> //复选框

      <el-table-column
        fixed
        prop="lid"
        label="序号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="ltitle"
        label="书名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="people.lname"
        label="请假人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="lnewtime"
        label="上市时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="loidtime"
        label="结束时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cause"
        label="原因"
        width="120">
      </el-table-column>
      <el-table-column
        prop="branch"
        label="部门"
        width="120">
      </el-table-column>
      <el-table-column
        prop="approver"
        label="审批人"
        width="120">
      </el-table-column>
      <el-table-column
        prop="lstatic"
        label="请假状态"
        :formatter="stateFormat"
        width="120">
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="unify"
        label="请假状态"
        :formatter="stateFormat"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope" >
          <el-button @click="handleClick(scope.row)"   v-if="$route.query.pid!=null && scope.row.lstatic==1 && scope.row.unify==0"  size="mini" type="primary" icon="el-icon-edit" circle></el-button>

          <el-button v-if="$route.query.pid!=null && scope.row.lstatic==1 && scope.row.unify==1" type="text" @click="look(scope.row)">查看</el-button>
          <el-button  @click="deletebook(scope.row)"   v-if="$route.query.pid!=null" size="mini" type="danger" icon="el-icon-delete" circle></el-button>

          <el-button @click="handleClick(scope.row)"   v-if="$route.query.pid==null && scope.row.lstatic==1"  type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="deletebook(scope.row)"    v-if="$route.query.pid==null && scope.row.lstatic==0" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      page-size="4"
      :total="total"
      @current-change="page">
    </el-pagination>
    <el-dialog title="假条" :visible.sync="dialogVisible" width="30%">
      <div id="printMe" >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="请假类型">
          <el-select v-model="form.ltitle" placeholder="请选择请假类型">
            <el-option label="事假" value="事假"></el-option>
            <el-option label="病假" value="病假"></el-option>
            <el-option label="产假" value="产假"></el-option>
            <el-option label="陪产假" value="陪产假"></el-option>
            <el-option label="长假" value="长假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" required>
          <el-col :span="11">
            <el-form-item >
              <el-date-picker type="date" placeholder="请假起始时间" v-model="form.lnewtime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item >
              <el-date-picker type="date" placeholder="请假结束时间" v-model="form.loidtime" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input  v-model="form.cause"></el-input>
        </el-form-item>
        <el-form-item label="审批人" >
          <el-input  v-model="form.approver"></el-input>
        </el-form-item>
        <el-form-item label="是否同意" >
          <el-radio-group v-model="form.unify">
            <el-radio label="1">符合申请</el-radio>
            <el-radio  label="0">未符合申请</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

      </div>
      <span slot="footer"  class="dialog-footer">
        <el-button type="primary" v-print="'#printMe'">打印</el-button>
        <el-button type="primary" @click="dialogVisible = false">返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        batchDeleteArr:[],
        total: null,
        tableData:null,
        dialogVisible:false,
        form: {
          lid: '',
          ltitle: '',
          lnewtime: '',
          loidtime: '',
          cause: '',
          approver: '',
          unify: ''
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.batchDeleteArr = val.map(item => item.lid).toString() ;

      },
      deletebook(row) {
        const _this = this
        axios.post('http://localhost:8001/delete?lid='+row.lid+'').then(function (resp) {
          _this.$message('删除成功!')
          window.location.reload()
        })
      },
      look(row){
        this.dialogVisible=true
        const _this = this
        axios.post('http://localhost:8001/findOne?lid='+row.lid+'').then(function (resp) {
          _this.form = resp.data.data.findone
          if (resp.data.data.findone.unify==1){
            _this.form.unify='1'
          } else {
            _this.form.unify='0'
          }

        })

      },
      stateFormat(row, column) {
        if (row.lstatic === 1 && row.unify===null) {
          return '审核中'
        } else if (row.lstatic === 0) {
          return '已归档'
        }else if (row.lstatic === 1 && row.unify===0) {
          return '审核未通过'
        }else if (row.lstatic === 1 && row.unify===1) {
          return '审核通过'
        }
      },
      handleClick(row) {
     if (this.$route.query.pid==null) {
       this.$router.push(
         {
           path: '/upstatic',
           query: {
             lid: row.lid
           }
         })
     }else {
       this.$router.push(
         {
           path: '/update',
           query: {
             lid: row.lid,
             pid: this.$route.query.pid
           }
         })
     }



      },
      page(currentchange) {
        const lthis = this
        if (this.$route.query.pid==null){
        axios.get('http://localhost:8001/findPage?page='+currentchange+'&rows=4').then(function (resp) {
          console.log(resp.data.total)
          lthis.tableData = resp.data.rows
          lthis.total = resp.data.total
        })
        }else {
          axios.get('http://localhost:8001/search?pid='+this.$route.query.pid+'&page='+currentchange+'&rows=4').then(function (resp) {
            console.log(resp.data.total)
            lthis.tableData = resp.data.rows
            lthis.total = resp.data.total
          })
        }
      },
      insert(){
        this.$router.push(
          {
            path: '/insert',
            query: {
              pid: this.$route.query.pid
            }
          })

      },
      // 批量删除
      batchDelete () {
        this.$confirm("确定删除？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const _this = this
          axios.post('http://localhost:8001/deleteall?userList='+this.batchDeleteArr+'').then(function (resp) {
            _this.$message('删除成功!')
            window.location.reload()
          })


        })

      },batchUpdate1(){
        this.$confirm("确定通过？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const _this = this
          axios.post('http://localhost:8001/upstatic1?userList='+this.batchDeleteArr+'').then(function (resp) {
            _this.$message('审核成功!')
            window.location.reload()
          })


        })
      },batchUpdate2(){
        this.$confirm("确定驳回？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const _this = this
          axios.post('http://localhost:8001/upstatic2?userList='+this.batchDeleteArr+'').then(function (resp) {
            _this.$message('驳回成功!')
            window.location.reload()
          })


        })
      }


    },
    created() {
      const lthis = this
      if (this.$route.query.pid!=null){
        axios.get('http://localhost:8001/search?pid='+this.$route.query.pid+'&page=1&rows=4').then(function (resp) {
          console.log(resp)
          lthis.tableData = resp.data.rows
          lthis.total = resp.data.total
        })
      }else {
        axios.get('http://localhost:8001/findPage?page=1&rows=4').then(function (resp) {
          lthis.tableData = resp.data.rows
          lthis.total = resp.data.total
        })
      }

    }
  }
</script>
<style>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }

</style>
