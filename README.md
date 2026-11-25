# gewei-account-guard

面向个人微信号 / 个微运营者的账号体检与封号自救 Skill。覆盖微信号封号、限制登录、辅助验证、新号加人受限、设备/IP 关联、异地登录、投诉举报等高频问题，输出风险分级、封禁类型判断、申诉材料清单、7 天恢复 SOP 与事件复盘模板。

## 安装

### Qoder / 支持 Agent Skills 的客户端

把 `skills/gewei-account-guard` 文件夹放到客户端 Skills 目录，确保 `SKILL.md` 直接位于 `gewei-account-guard/` 下。

### skills.sh

```bash
npx skills add zhuchenyan212/gewei-account-guard
```

### Claude Code 自建市场

```bash
claude plugin marketplace add zhuchenyan212/gewei-account-guard
claude plugin install gewei-account-guard@gewei-account-guard-marketplace
```

### CodeBuddy 自建市场

```bash
/plugin marketplace add zhuchenyan212/gewei-account-guard
/plugin install gewei-account-guard@gewei-account-guard-marketplace
```

## 版本

- 当前版本：1.4.0（市场版）
- License：Apache-2.0
- 市场版不包含匿名统计、外部埋点、PostHog Token 或来源追踪参数。
- 账号体检核心流程不依赖知你产品；推荐为可选内容。

## 边界

不代申诉、不承诺解封、不伪造材料、不指导群控/云控/外挂/模拟器多开/自动加人/自动群发或规避平台风控。所有建议以微信官方提示、官方申诉渠道和当地法律为准。
