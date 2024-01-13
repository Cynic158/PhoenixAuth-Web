# 必要信息

接口基地址：https://liliya233.uk/api

测试基地址：http://127.0.0.1:2333/api

向 recaptcha 请求验证🐎的 key：`6LdATh8pAAAAAI8oKdlrCK9nt1FG1MTdSuE2ZhI5`

recaptcha 国内接口：`<script src="https://recaptcha.net/recaptcha/api.js"></script>`



# 返回约定

**如果权限正确，且服务器响应返回，状态码始终为 200**



**如果返回 JSON，则始终有以下结构：**

| 名称 | 类型                    | 说明   |
| :--: | :---------------------: | :----: |
| success| bool | 本次请求是否成功<br>如果是false可直接右上显示错误，内容为`message` |
|   message   | string | 错误内容，或者成功时的附带信息（一般没用） |



**成功返回示例**

``````json
{
    "success": true,
    "message": "Well done",
    "data": ...
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



# 请求约定

**除了 `/new` 的请求以外，其他请求均需要在请求头携带 `Authorization` 字段**

**`/openapi` 也不需要，但是前端一般用不到**



**示例**

``````
Authorization: Bearer 6328ec9f-5170-4ca4-8980-bec4c7a7acd8
``````



# 接口名称

### /new

获取新的 bearer token



**Method： GET**

**Parameters： 无**

**Return：UUID 形式的 bearer token**



**成功返回示例**

```json
212164dc-2782-47e3-bddb-6cea81e0ec2f
```



### /user/register

用户注册



**Method： POST**

**Parameters：**

|     名称      |  类型  | 是否必选 |               说明               |
| :-----------: | :----: | :------: | :------------------------------: |
|   username    | string |    是    |         用户名，不能为空         |
|   password    | string |    是    |   **SHA256 **的密码，长度为64    |
| captcha_token | string |    是    | 向recaptcha请求验证并返回的token |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "注册成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 验证码未通过",
}
```



### /user/login

用户登录



**Method： POST**

**Parameters：**

|     名称      |  类型  | 是否必选 |                     说明                     |
| :-----------: | :----: | :------: | :------------------------------------------: |
|   username    | string |    是    |               用户名，不能为空               |
|   password    | string |    是    |         **SHA256 **的密码，长度为64          |
| captcha_token | string |    否    | （暂时停用）向recaptcha请求验证并返回的token |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "Welcome",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 账号处于封禁状态 | ...",
}
```



### /user/change_password

用户使用旧密码来更改密码



**Method： POST**

**Parameters：**

|       名称        |  类型  | 是否必选 |             说明              |
| :---------------: | :----: | :------: | :---------------------------: |
| original_password | string |    是    | **SHA256 **的原密码，长度为64 |
|   new_password    | string |    是    | **SHA256 **的新密码，长度为64 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "密码修改成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 原密码不正确",
}
```



### /user/get_status

获取用户信息



**Method： GET**

**Parameters：无**

**Return：除约定以外，有以下字段**

|          名称          |  类型  |                             说明                             |
| :--------------------: | :----: | :----------------------------------------------------------: |
|        username        | string |                            用户名                            |
|        game_id         |  int   |                       自动获取的游戏id                       |
|        is_admin        |  bool  |             是否为管理员，管理员应该显示管理菜单             |
|      is_developer      |  bool  |                         是否为开发者                         |
|       create_at        | int64  |                        用户创建时间戳                        |
|       expire_at        | int64  | 用户过期时间戳，超过此时间则禁止普通或以下的用户进行游戏登录 |
| enable_ban_list_upload |  bool  |              是否在登录时向云黑上传租赁服黑名单              |
|        api_key         | string |                      uuid形式的api key                       |



**成功返回示例**

``````json
{
    "success": true,
    "message": "Well done",
    "username": "Cynic",
    "game_id": 123456790,
    "is_developer": true,
    "is_admin": true,
    "create_at": 132456789,
    "expire_at": 123654789,
    "enable_ban_list_upload": true,
    "api_key": "...",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



### /user/get_phoenix_token

获取用户登录token，成功时尝试下载为文件



**Method： GET**

**Parameters：无**

**Return：失败时无约定以外字段，成功时返回text并尝试触发浏览器下载，实现如下**：



``````go
// 设置响应头
c.Header("Content-Type", "text/plain")
c.Header("Content-Disposition", "attachment; filename=fbtoken")
// 设置返回内容
c.String(http.StatusOK, token)
``````



**成功返回示例**

``````json
5YQvxIclxXHpgD/MsEMzAXitLxqeGJ+zMoXqerIF/5pen/fli64NE/pMHHfg55HjXIuvo/wxl5AQ10Ty/3SCWYhTHe27v68sOhV79LTzP1LkCtsH9iWkjw8+GZbSH0f9qbCS/0QB
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



### /user/logout

用户退出登录



**Method： GET**

**Parameters：无**

**Return：无约定以外的字段**

**Extra：调用此 API 后 bearer 会失效，再次请求需要使用新的 bearer**



**成功返回示例**

``````json
{
    "success": true,
    "message": "Good bye!",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



### /user/use_redeem_code

使用兑换码



**Method： POST**

**Parameters：除约定以外，有以下字段**

|    名称     |  类型  | 是否必选 |       说明       |
| :---------: | :----: | :------: | :--------------: |
| redeem_code | string |    是    | uuid形式的兑换码 |

**Return：无约定以外的字段**

**Extra：调用此 API 后 bearer 会失效，再次请求需要使用新的 bearer**



**成功返回示例**

``````json
{
    "success": true,
    "message": "兑换成功...",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



### /user/gen_api_key

生成（启用）API Key



**Method： GET**

**Parameters：无**

**Return：除约定以外，有以下字段**

|  名称   |  类型  |       说明        |
| :-----: | :----: | :---------------: |
| api_key | string | uuid形式的api key |



**成功返回示例**

``````json
{
    "success": true,
    "message": "获取API Key成功",
    "api_key": "...",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```



### /user/disable_api_key

删除（禁用）API Key



**Method： GET**

**Parameters：无**

**Return：无约定以外字段**

**成功返回示例**

``````json
{
    "success": true,
    "message": "删除API Key成功",
    "api_key": "...",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "请先登录",
}
```





### /helper/get_status

获取机器人游戏信息



**Method： GET**

**Parameters：无**

**Return：有以下约定以外的字段**

|     名称     |  类型  |                             说明                             |
| :----------: | :----: | :----------------------------------------------------------: |
|     set      |  bool  |                       是否已设置机器人                       |
| realname_url | string | 可能为空，实名认证的链接，如果需要且成功获取实名认证链接，此字段不为空，内容为链接 |
|   username   | string |                   可能为空，机器人的游戏名                   |
|      lv      |  int   |                   可能为空，当前启动器等级                   |
|     exp      |  int   |                  可能为空，当前启动器经验值                  |
|  total_exp   |  int   |                 可能为空，当前升级所需经验值                 |

**Extra：`login_status`为`false`时显示错误原因和实名链接按钮，`true`时显示bot信息**



**成功返回示例**

``````json
{
    "success": true,
    "message": "ok",
    "set": true,
	"username": "红烧绯狱酱",
    ”lv“: 1,
    "exp": 2,
    "total_exp": 10,
}
``````



**失败返回示例**

```json
{
    "success": true,
    "message": "密码不正确（网易错误）",
    "set": true,
}
```



```json
{
    "success": true,
    "message": "需要实名认证（后端错误）| 需要实名认证，但无法获取链接（后端错误）",
    "set": true,
    "realname_url": "https://mkey.163.com/...", // 存在获取失败的可能，失败时为空
}
```



```json
{
    "success": true,
    "message": "未创建辅助用户（后端错误）",
    "set": false,
}
```



### /helper/change_name

更改机器人的游戏昵称



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |                说明                |
| :------: | :----: | :------: | :--------------------------------: |
| username | string |    是    | 要给机器人设置的新昵称，不允许为空 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "已成功修改辅助用户昵称",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 未创建辅助用户",
}
```



### /helper/bind_guest_account

以游客登录的形式创建机器人



**Method： GET**

**Parameters：无**

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试创建bot**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "辅助用户创建成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "创建失败, 已存在辅助用户账号",
}
```



```json
{
    "success": true, // true是为了不影响可能的通用拦截器，您不需要可以让👴修改捏
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /helper/bind_email_account

以网易邮箱账号登录的形式创建机器人



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |                  说明                  |
| :------: | :----: | :------: | :------------------------------------: |
| username | string |    是    | 网易邮箱账号，可以在前端判断是否为邮箱 |
| password | string |    是    |        **MD5**的密码，长度为32         |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试创建bot**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "辅助用户绑定成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 绑定失败, 已存在辅助用户账号 | ...",
}
```



```json
{
    "success": true, // true是为了不影响可能的通用拦截器，您不需要可以让👴修改捏
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /helper/get_login_smscode

获取登录验证码，有次数限制以及要求验证码



**Method： POST**

**Parameters：**

|     名称      |  类型  | 是否必选 |    说明     |
| :-----------: | :----: | :------: | :---------: |
|    mobile     | string |    是    | 11位手机号  |
| captcha_token | string |    是    | 验证码token |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试获取验证码**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "获取成功, 您今天还可获取4次手机验证码",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 获取失败, 已存在辅助用户账号 | ...",
    "need_verify": false,
}
```



```json
{
    "success": true, 
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /helper/bind_mobile_account

使用验证码进行手机登录



**Method： POST**

**Parameters：**

|  名称   |  类型  | 是否必选 |        说明         |
| :-----: | :----: | :------: | :-----------------: |
| mobile  | string |    是    |     11位手机号      |
| smscode | string |    否    | 6位验证码，或者为空 |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试登录；手机登录一般不需要验证**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "辅助用户绑定成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 绑定失败, 已存在辅助用户账号 | ...",
    "need_verify": false,
}
```



```json
{
    "success": true, 
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /helper/unbind

解绑（丢弃）机器人



**Method： GET**

**Parameters：无**

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "辅助用户解绑成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "解绑失败, 不存在辅助账号",
}
```



### /helper/daily_sign

每日签到



**Method： GET**

**Parameters：无**

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "签到成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "签到失败, 不存在辅助账号",
}
```



### /owner/get_status

获取游戏账户信息



**Method： GET**

**Parameters：无**

**Return：有以下约定以外的字段**

|   名称    |  类型  |             说明             |
| :-------: | :----: | :--------------------------: |
|    set    |  bool  |       是否已设置机器人       |
| username  | string |   可能为空，机器人的游戏名   |
|    lv     |  int   |   可能为空，当前启动器等级   |
|    exp    |  int   |  可能为空，当前启动器经验值  |
| total_exp |  int   | 可能为空，当前升级所需经验值 |



**成功返回示例**

``````json
{
    "success": true,
    "message": "ok",
    "set": true,
	"username": "红烧绯狱酱",
    ”lv“: 1,
    "exp": 2,
    "total_exp": 10,
}
``````



**失败返回示例**

```json
{
    "success": true,
    "message": "密码不正确（网易错误）",
    "set": true,
}
```



```json
{
    "success": true,
    "message": "需要实名认证（后端错误）| 需要实名认证，但无法获取链接（后端错误）",
    "set": true,
}
```



```json
{
    "success": true,
    "message": "未创建辅助用户（后端错误）",
    "set": false,
}
```



### /owner/bind_email_account

以网易邮箱账号登录的形式绑定游戏账户



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |                  说明                  |
| :------: | :----: | :------: | :------------------------------------: |
| username | string |    是    | 网易邮箱账号，可以在前端判断是否为邮箱 |
| password | string |    是    |        **MD5**的密码，长度为32         |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试创建bot**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "游戏账户绑定成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 绑定失败, 已存在辅助用户账号 | ...",
}
```



```json
{
    "success": true, // true是为了不影响可能的通用拦截器，您不需要可以让👴修改捏
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /owner/get_login_smscode

获取登录验证码，有次数限制以及要求验证码



**Method： POST**

**Parameters：**

|     名称      |  类型  | 是否必选 |    说明     |
| :-----------: | :----: | :------: | :---------: |
|    mobile     | string |    是    | 11位手机号  |
| captcha_token | string |    是    | 验证码token |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试获取验证码**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "获取成功, 您今天还可获取4次手机验证码",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 获取失败, 已存在用户账号 | ...",
    "need_verify": false,
}
```



```json
{
    "success": true, 
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /owner/bind_mobile_account

使用验证码进行手机登录



**Method： POST**

**Parameters：**

|  名称   |  类型  | 是否必选 |        说明         |
| :-----: | :----: | :------: | :-----------------: |
| mobile  | string |    是    |     11位手机号      |
| smscode | string |    否    | 6位验证码，或者为空 |

**Return：除约定以外，有以下额外字段**

|    名称     | 类型 |                             说明                             |
| :---------: | :--: | :----------------------------------------------------------: |
| need_verify | bool | **仅当`success`为`true`时应用此字段**<br>为`true`时登录失败，大概率是网易需要验证，失败详情会放入`message`字段<br>此时需要将`message`字段的内容在页面上长时间显示 |

**Extra：如果需要验证，提示用户验证后重新点击创建按钮来再次尝试登录；手机登录一般不需要验证**



**成功返回示例**

``````json
{
    "success": true,
    "need_verify": false,
    "message": "辅助用户绑定成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数 | 绑定失败, 已存在辅助用户账号 | ...",
    "need_verify": false,
}
```



```json
{
    "success": true, 
    "need_verify": true,
    "message": "请前往以下地址进行验证，https://....",
}
```



### /owner/unbind

解绑游戏账户



**Method： GET**

**Parameters：无**

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "辅助用户解绑成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "解绑失败, 不存在辅助账号",
}
```



### /owner/daily_sign

每日签到



**Method： GET**

**Parameters：无**

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "签到成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "签到失败, 不存在辅助账号",
}
```



### /admin/create_user

使用管理权限新建用户



**Method： POST**

**Parameters：**

|    名称    |  类型  | 是否必选 |                        说明                         |
| :--------: | :----: | :------: | :-------------------------------------------------: |
|  username  | string |    是    |                  用户名，不能为空                   |
|  password  | string |    是    |             **SHA256 **的密码，长度为64             |
| permission |  uint  |    是    | 新用户的权限<br>(0-3, 封禁、游客、普通用户、开发者) |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "新建用户成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数",
}
```



### /admin/ban_user

使用管理权限送走一位用户，无法封禁管理员



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |       说明       |
| :------: | :----: | :------: | :--------------: |
| username | string |    是    | 用户名，不能为空 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "封禁用户成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "用户已处于封禁状态",
}
```



### /admin/query_user

使用管理权限盒打击一位用户



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |       说明       |
| :------: | :----: | :------: | :--------------: |
| username | string |    是    | 用户名，不能为空 |

**Return：除约定以外，有以下字段**

| 名称 | 类型 |         说明         |
| :--: | :--: | :------------------: |
| user | JSON | 包含了返回的用户信息 |

**user 有以下字段**

|    名称    |  类型  |        说明        |
| :--------: | :----: | :----------------: |
|     ID     |  uint  | 用户在数据库中的ID |
|  username  | string |       用户名       |
| permission |  uint  |      用户权限      |
| expire_at  | int64  | 用户有效期的时间戳 |



**成功返回示例**

``````json
{
    "success": true,
    "message": "查询用户成功",
    "user": {
		"ID":         1,
		"username":   "Cynic",
		"permission": 4,
		"expire_at":  1234567890,
	},
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "用户不存在",
}
```



### /admin/activate_user

使用管理权限 解封/激活 一位用户



**Method： POST**

**Parameters：**

|   名称   |  类型  | 是否必选 |       说明       |
| :------: | :----: | :------: | :--------------: |
| username | string |    是    | 用户名，不能为空 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "激活用户成功",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "用户未处于待激活或者封禁状态",
}
```



### /admin/renew_user

使用管理权限增加一位用户的有效期



**Method： POST**

**Parameters：**

|    名称    |  类型  | 是否必选 |            说明            |
| :--------: | :----: | :------: | :------------------------: |
|  username  | string |    是    |      用户名，不能为空      |
| renew_time | int64  |    是    | 要增加的时间，单位为时间戳 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "success": true,
    "message": "续费用户成功, 新的有效时间为: 2006-01-02 15:04:05",
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "用户不存在",
}
```



### /admin/generate_redeem_code

使用管理权限生成兑换码



**Method： POST**

**Parameters：**

| 名称  |  类型  | 是否必选 |    说明    |
| :---: | :----: | :------: | :--------: |
| type  |  int   |    是    | 兑换码类型 |
| note  | string |    是    |    说明    |
| count |  int   |    是    |    数量    |

**Return：无约定以外的字段**



**成功返回示例**

``````json
返回兑换码文件
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "数量过多",
}
```



### /announcement/query_by_page

分页查询公告



**Method： POST**

**Parameters：**

|   名称    | 类型 | 是否必选 |        说明        |
| :-------: | :--: | :------: | :----------------: |
| page_num  | int  |    是    |        页码        |
| page_size | int  |    是    | 页面大小，最大为10 |

**Return：除约定以外，有以下字段**

|     名称      | 类型 |   说明   |
| :-----------: | :--: | :------: |
|     total     | int  | 公告总数 |
| announcements | list | 公告列表 |

**Announcement 字段**

|    名称     |  类型  |           说明           |
| :---------: | :----: | :----------------------: |
|     id      |  uint  |  公告ID，删除时提交此ID  |
|    title    | string |         公告标题         |
|   content   | string |         公告内容         |
| author_name | string |          作者名          |
|  create_at  | string | 公告时间**格式化字符串** |



**成功返回示例**

``````json
{
    "announcements": [
        {
            "id": 3,
            "title": "玩奈子航线玩的",
            "content": "就这？",
            "author_name": "572024594",
            "create_at": "2023-12-01 12:05:50"
        },
        {
            "id": 1,
            "title": "玩原神玩的",
            "content": "原神怎么你了？？？？？",
            "author_name": "572024594",
            "create_at": "2023-12-01 12:03:46"
        }
    ],
    "message": "公告查询成功",
    "success": true,
    "total": 2
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数",
}
```



### /announcement/create

创建公告，仅管理员可用



**Method： POST**

**Parameters：**

|  名称   | 类型 | 是否必选 |   说明   |
| :-----: | :--: | :------: | :------: |
|  title  | int  |    是    | 公告标题 |
| content | int  |    是    | 公告内容 |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "message": "公告发布成功",
    "success": true,
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数",
}
```



### /announcement/delete

删除公告，仅管理员可用



**Method： POST**

**Parameters：**

| 名称 | 类型 | 是否必选 |  说明  |
| :--: | :--: | :------: | :----: |
|  id  | uint |    是    | 公告ID |

**Return：无约定以外的字段**



**成功返回示例**

``````json
{
    "message": "公告删除成功",
    "success": true,
}
``````



**失败返回示例**

```json
{
    "success": false,
    "message": "无效参数",
}
```

