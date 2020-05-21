<template>
  <div id="app">
    <div class="option">
      <h3>Options</h3>
      <h5>Editor</h5>
      <section class="switch" v-for="(item, key) in codes" :key="key">
        <van-switch @change="codeChange(key)" v-model="item.show" size="18px" />
        <span>{{ key }}</span>
      </section>
      <h5>frame</h5>
      <section class="switch" v-for="item in frames" :key="item.name">
        <van-switch v-model="item.show" size="18px" />
        <span>{{ item.name }}</span>
      </section>
    </div>
    <div class="codepen">
      <h3>Code Editor</h3>
      <div v-for="(item, key) in codes" :key="key" v-show="item.show">
        <p class="name">{{ key }}</p>
        <codemirror
          @input="codeChange(key)"
          class="code"
          v-model="item.code"
          :options="{ mode: item.mode }"
        />
      </div>
    </div>
    <div class="online">
      <h3>Online Connect</h3>
      <div v-if="token === 'onecho-admin'">
        <div v-if="room">
          <p class="layout">
            面试者连接地址：
            <br />
            http://118.31.58.18/online/#/{{ room }}
          </p>
          <p class="layout">面试官：{{ examiner }} —— 面试者：{{ examinee }}</p>
          <van-button
            lass="layout"
            type="warning"
            @click="closeSocket"
            class="layout"
            size="small"
          >关闭房间</van-button>
          <p class="tip">连接后，面试官所出题目与回答内容将同步</p>
          <van-field
            label-width="50"
            @input="giveQuestion"
            type="textarea"
            autosize
            v-model="question"
            label="问题"
          />
        </div>
        <div v-else>
          <van-field label-width="50" v-model="examiner" label="面试官" />
          <van-field label-width="50" v-model="password" type="password" label="密码" />
          <van-button
            block
            :disabled="!password || !examiner"
            @click="open"
            class="layout"
            type="info"
            size="small"
          >建立房间</van-button>
        </div>
      </div>
      <div v-else>
        <p class="layout">{{ examiner ? `已连接面试官：${examiner}` : '未连接面试官'}}</p>
        <p class="layout">题目：{{ question }}</p>
        <p class="tip">连接后，面试官所出题目与回答内容将同步</p>
        <p class="tip">答题过程中，请与面试官保持通话；如有任何问题，可咨询面试官</p>
        <van-field label-width="50" center v-model="examinee" label="姓名" v-if="!examiner">
          <template #button>
            <van-button size="small" @click="linkAdmin" :disabled="!examinee" type="info">连接</van-button>
          </template>
        </van-field>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import md5 from "blueimp-md5";

export default {
  name: "app",
  data: () => ({
    codes: {
      html: {
        mode: "text/html",
        code: "<!-- 直接写body内容 -->\n",
        show: true
      },
      css: { mode: "text/css", code: "", show: true },
      less: { mode: "text/css", code: "", show: false },
      javascript: { mode: "text/javascript", code: "", show: false },
      typescript: { mode: "text/typescript", code: "", show: false },
      vuecli: { mode: "text/x-vue", code: "", show: false },
      php: { mode: "text/x-php", code: "<?php\n", show: false }
    },
    frames: [
      { name: "bootstrap", show: false },
      { name: "jQuery", show: false },
      { name: "vue", show: false },
      { name: "thinkphp5", show: false },
      { name: "laravel", show: false }
    ],
    password: "",
    examiner: "",
    examinee: "",
    token: "",
    room: "",
    question: "尚未出题"
  }),
  methods: {
    connect(path) {
      const socket = io.connect("http://localhost:3366" + path);
      this.socket = socket;
      socket.on("open", res => {
        if (res.status === 200) {
          for (let type in res.data) this[type] = res.data[type];
          this.$notify({ type: "primary", message: res.message });
        } else {
          socket.close();
          this.$notify({ type: "warning", message: res.message });
        }
      });
      socket.on("code", code => {
        this.codes[code.key] = code.code;
      });
      if (path.includes("token"))
        socket.on("question", question => {
          this.question = question;
        });
    },
    open() {
      const password = md5(this.password);
      if (password === "63547a37f8971c5c68103de99c5a804c")
        this.connect("?examiner=" + this.examiner);
      else this.$notify({ type: "warning", message: "密码错误" });
    },
    linkAdmin() {
      if (this.token)
        this.connect(`?examinee=${this.examinee}&token=${this.token}`);
      else this.$notify({ type: "warning", message: "连接错误" });
    },
    codeChange(key) {
      if (this.socket) {
        this.socket.emit("code", {
          code: this.codes[key],
          key
        });
      }
    },
    giveQuestion() {
      if (this.socket) {
        this.socket.emit("question", this.question);
      }
    },
    closeSocket() {
      if (this.socket) {
        this.socket.close();
      }
    }
  },
  created() {
    const token = location.hash.slice(2);
    this.token = token;
  }
};
</script>

<style lang="less" scoped>
#app {
  min-height: 100vh;
  background-color: #eee;
  display: flex;
  flex-wrap: wrap;
  .option {
    padding: 0 20px;
    min-width: 120px;
    width: 10%;
    .switch {
      display: flex;
      align-items: center;
      span {
        line-height: 36px;
        margin-left: 10px;
      }
    }
    h5 {
      margin: 15px 0 0;
    }
  }
  .codepen {
    flex: 1;
    padding: 0 10px 10px;
    .name {
      padding-left: 10px;
      margin: 15px 0 5px;
    }
    .code {
      font-size: 16px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
  .online {
    padding: 0 10px 20px;
    width: 30%;
    .tip {
      color: #999;
      font-size: 12px;
      margin: 0 0 10px;
    }
    .layout {
      margin: 10px 0;
      word-wrap: break-word;
    }
  }
}
</style>