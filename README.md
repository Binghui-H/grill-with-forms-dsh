# dsh-grill-with-forms

用 DSH 原生提问卡片做设计澄清：一轮把互不依赖的决策题一次问完，每题带推荐答案，用户随时可以自己写字。

一个 DSH 插件包，内含 4 个技能、约 120 行代码，不含任何常驻服务。

## 它解决的问题

设计方案卡在一堆未定的决策上时，逐条问太慢，一次全问又会打乱依赖顺序。这个插件把"决策树 + 前沿（frontier）"这套提问纪律落成技能：

```text
用户目标
  → /grill-with-forms（或 /grill-me、/grill-with-docs）
  → 先自己查事实，只把决策交给用户
  → 算出"现在就能问"的那一层（前沿）
  → 一次 ask_user_question 调用问完这一层
  → 原生卡片：单选 / 多选 / 推荐徽标 / 自由填写
  → 答案回来，重算前沿，再问下一层
  → 前沿空了 → 汇总已定决策 + 剩余假设
```

## 三个入口

入口是**在输入框敲 `/`**——`disable-model-invocation: true` 的技能只从这条路径进入，菜单里会带"仅限用户"标记。

| 入口 | 怎么问 | 什么时候用 |
|---|---|---|
| `/grill-me` | **不给选项**，纯开放问题，一轮一停；收尾问一句要不要记决策表 | 设计还很模糊，选择题会把它压扁 |
| `/grill-with-forms` | 3~6 题一批，选择题 + 推荐徽标；收尾问一句要不要记决策表 | 决策已经能枚举，要快速拍板 |
| `/grill-with-docs` | 同上，外加术语表 / ADR 落盘 | 结论要活过这次会话 |

`grilling` 是被调用的库：它必须 `modelInvocable`，否则 `skill` 工具会拒绝加载它。

> 注意依赖方向：`grill-with-forms` **不**依赖 `grill-with-docs`。后者反过来依赖前者的卡片规则，但它是通过共享参考文件读的（`references/form-batching.md`），不是加载兄弟技能——那三个入口模型无权加载，跨技能加载会直接失败。

## 安装

### 插件包（推荐）

```powershell
dsh plugin --profile desktop add D:\git\grill-with-forms-dsh
```

也可以用 tarball 或 git：

```powershell
dsh plugin --profile desktop add ./dsh-grill-with-forms-0.1.0.tgz
dsh plugin --profile desktop add github:Binghui-H/grill-with-forms-dsh
```

装完**不需要重启**：技能目录会立刻刷新，`/` 菜单里就能看到三个入口。卸载：

```powershell
dsh plugin --profile desktop remove dsh-grill-with-forms
```

### 纯文件（不用插件管理器）

技能正文本身是 Markdown，可以直接放进 `~/.dsh/skills/`。**注意要一起拷 `references/`**，否则技能里引用的参考文件会指空：

```powershell
$src = 'D:\git\grill-with-forms-dsh\assets'
foreach ($skill in 'grilling','grill-me','grill-with-forms','grill-with-docs') {
  $dst = "$env:USERPROFILE\.dsh\skills\$skill"
  New-Item -ItemType Directory -Force "$dst\references" | Out-Null
  Copy-Item "$src\skills\$skill\SKILL.md" $dst -Force
  Copy-Item "$src\references\*.md" "$dst\references" -Force
}
```

两种装法的行为一致：技能 frontmatter 里的 `disable-model-invocation` / `user-invocable` 与插件提供给注册表的调用策略是同一套语义。

## 一张卡片长什么样

```json
{
  "questions": [
    {
      "id": "release_scope",
      "header": "Release scope",
      "question": "0.1 只发桌面端吗？",
      "options": [
        { "label": "只发桌面端 (Recommended)", "description": "一个版本能认真支持的surface 最小。" },
        { "label": "桌面端 + Web", "description": "测试矩阵和支持面翻倍。" }
      ]
    }
  ]
}
```

答案回来是 `{ id, selected, custom? }`：

| 返回 | 含义 |
|---|---|
| `selected: ["只发桌面端 (Recommended)"]` | 用户点了推荐项 |
| `selected: []` + `custom: "只有桌面端"` | 用户**自己写了答案**。单选时 `selected` 会被清空——这是规范行为，不是丢答案 |
| `selected: []` 且无 `custom` | 跳过。该决策**仍然未定**，不能当"否" |
| 工具报错 | 没有提问提供方，降级成文字提问 |

第二行不是边角情况：实测中，有自由输入框时用户会直接打字而不点选项。所以 `custom` 被当作一等答案处理。

## 收尾与产物

每个会话收尾都是三步：汇总已定决策 + 列出剩余假设 → **问一句**要不要写决策表 → 不做别的。

| 产物 | 谁写 | 触发 |
|---|---|---|
| `.grill/<slug>-decisions.md` | **三个入口各自问一次** | 收尾时**问一句**，你点头才写 |
| `GLOSSARY.md` | `grill-with-docs` | 术语一确定就写，不批量 |
| `docs/adr/NNNN-*.md` | `grill-with-docs` | 难以逆转 + 无上下文会困惑 + 真有权衡，三条全中才写 |

决策表需要的是**抄写**，不需要判断，所以它跟着每个入口走——按方案 C 从 `grill-with-docs` 下放到了所有会话。原来只有打 `/grill-with-docs` 才留痕，意味着"随手问个设计"永远没有精确记录，而上下文一压缩，"重试上限 3 次，第 4 次终止"就被磨成"重试有上限"。

`/grill-me` 比卡片更需要它：卡片的答案至少绑在一个可回引的标签上，开放问答只活在用户的措辞里，一概括就没了。

术语表和 ADR 需要判断（哪些词是项目特有的、哪个决策过得了三道门），所以仍然只在 `/grill-with-docs` 里做，且不做则已、做则写盘并报告路径。

## 为什么不是把 Codex 版搬过来

原来的 `grill-with-forms` 是 Codex 插件：MCP server + `elicitation/create` + zod 校验 + 15 分钟超时。到 DSH 上这套**整体失效**：

| Codex 版依赖 | DSH 实际 |
|---|---|
| MCP `elicitation/create` 原生表单 | `dsh-mcp-client` 不支持 elicitation（源码里零命中） |
| 自己校验题目/选项/分批 | `ask_user_question` 已有 id / options / multi_select / 描述 |
| 自己实现"其他"自由输入 | 原生就有 `custom` 字段，单选时覆盖选中项 |
| 自己处理超时与审批 | 工具等待人类作答，取消走当轮 signal |
| 技能间靠委派共享逻辑 | `resourceBase` + `<skill_resources>` 给出绝对路径，直接读 `references/` |

所以这个仓库里没有 server、没有 zod、没有 MCP 配置。留下的只有提问纪律。

## 目录

```text
index.js                 apply(ctx) → ctx.skills.registerProvider
lib/skills.js            技能提供方：扫 assets/skills/*/SKILL.md，resourceBase = assets/
assets/skills/*/SKILL.md  四个技能正文
assets/references/*.md    共享参考（提问规则、卡片规则、术语表/ADR 格式、决策表格式）
cordis.patch.yml         插入 grill-with-forms 插件行
test/skills.spec.mjs     技能树契约测试
docs/                    每个技能一篇说明（人读，随包发布）
.out-of-scope/           明确不做什么，以及为什么（仅仓库，不进 npm 包）
```

## 开发

```powershell
# 契约测试：技能树、frontmatter 格式、引用完整性、调用策略
node test/skills.spec.mjs
```

`node --test` 也能跑，但它为每个测试文件 spawn 子进程；在某些受限沙箱里会因管道限制报 `EPERM`，直接跑文件更稳。

**改完之后要不要重载插件，取决于改了什么。** 提供方的候选表（名字、描述、调用策略）在 `list()` 时生成，注册表缓存它直到收到 `skills/change`；而 `get()` 每次调用都重读文件。

| 改动 | 要重载吗 | 原因 |
|---|---|---|
| 技能正文措辞 | **不用** | `get()` 每次 `readFile` 重读 |
| `description` | 要 | 目录里的描述来自候选表缓存 |
| 新增/删除技能目录 | 要 | 候选表是 `list()` 时生成的 |
| `disable-model-invocation` / `user-invocable` | 要 | 调用策略也在候选表里 |

要重载时：

```powershell
dsh plugin --profile desktop remove dsh-grill-with-forms
dsh plugin --profile desktop add D:\git\grill-with-forms-dsh
```

## 已知限制

- **问题级没有 `detail` 字段。** `ask_user_question` 只暴露 `header` / `question` / `options`。原来 Codex 版每题有独立 `description`，"这题为什么重要"现在只能写进题干或选项的 `description`。
- **推荐徽标靠标签后缀。** 约定是推荐项排第一 + 标签末尾加 `(Recommended)`。如果你的客户端版本不渲染徽标，推荐仍在标签文字里，不会丢。
- **提问工具按 agent preset 挂载。** 某些组装下没有提问提供方，技能会降级成文字提问，不会假装弹了卡片。
- **子代理不能替你提问。** 归属另一个存活 agent 的子代理调用会被拒绝（`DELEGATED_CALLER`），未决问题必须写进子代理的最终结果。
- **卡片上限是 UX 约束，不是能力约束。** 8 题、每题 8 个选项是刻意的：超过就该拆批或改成开放问题。

## 归属

提问纪律与术语表/ADR 格式改编自 [mattpocock/skills](https://github.com/mattpocock/skills)（MIT，© 2026 Matt Pocock）。详见 [ATTRIBUTION.md](./ATTRIBUTION.md)。

## English

[README.en.md](./README.en.md)
