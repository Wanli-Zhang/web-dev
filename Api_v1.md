### 1. 请求返回通用格式
方式：GET, POST, PUT, DELETE
格式：
```json
{
	err_code: int (成功为 0，失败为其他)
	err_msg: string (成功为 'success')
	data: json (具体数据)
}
```
### 2. 具体请求及返回格式
#### 1. 登录
URL：/login
方式：POST
传入格式：
```json
{
	username: string (唯一标示用户/商家)
	password: string
	role: string (customer/merchant/administrator)
}
```
返回 data：
1. customer：
```json
{
	name: string
	level: int (普通客户为 0，大客户为 1，钻石客户为 2)
	phone: string
	address: string
	create_time: int
}
```
2. merchant：
```json
{
	name: string
	level: int (小商店为 0，普通商店为 1，旗舰商店为 2)
	phone: string
	kind: string (商家种类)
	create_time: int
}
```
3. administrator：空
#### 2. 管理员获取信息
URL：/customers (获取商家改为 merchants)
方式：GET
返回 data：
```json
[
	{
		username: string
		name: string
		level: int (普通客户为 0，大客户为 1，钻石客户为 2)
		phone: string
		address: string
		create_time: int
	}
	...
]
```
#### 3. 管理员新增信息
URL：/customers (新增商家改为 merchants)
方式：POST
传入格式：
```json
{
	username: string
	password: string
	name: string
	level: int (普通客户为 0，大客户为 1，钻石客户为 2)
	phone: string
	address: string
}
```
返回 data：空
#### 4. 管理员删除信息
URL：/customer/:username (删除商家改为merchants)
方式：DELETE
返回 data：空
#### 5. 管理员更新信息
URL：/customer/:username  (更新商家改为merchants)
方式：PUT
传入格式：
```json
{
	password: string (管理员不可修改，传入时无此字段；客户可修改，可选)
	name: string (可选)
	level: int (可选)
	phone: string (可选)
	address: string (可选)
}
```
返回 data：空
#### 6. 获得管理员列表
URL：/administrators
方式：GET
返回 data：
```json
[
	username,
	username,
	...
]
```
#### 7. 删除管理员
URL：/administrator/:username
方式：DELETE
返回 data：空
#### 8. 管理员修改密码
URL：/administrator/:username
方式：PUT
传入格式：
```json
{
	password: string
}
```
返回 data：空
#### 9. 商家查询对应客户信息
URL：/merchant/:username/customers
方式：GET
返回 data：
```json
[
	{
		username: string
		name: string
		level: int (普通客户为 0，大客户为 1，钻石客户为 2)
		phone: string
		address: string
		create_time: int
		total_amount: float (该客户在该商家的消费总额)
		total_count: int (该客户在该商家的消费总次数)
	}
	...
]
```
#### 10. 商家查询某个客户在某店交易记录
URL：/merchant/:m_username/customer/:c_username
方式：GET
返回 data：
```json
[
	{
		trans_id: int (自动生成的交易记录 id)
		trans_time: int (交易时间)
		trans_amount: float (交易金额)
	}
	...
]
```
#### 11. 新增一条交易记录
URL: /merchant/:m_username/customer/:c_username
方式：POST
传入格式：
```json
{
	trans_amount: float (交易金额)
}
```
返回 data：
```json
{
	trans_id: int (自动生成的交易记录 id)
	trans_time: int (交易时间)
	trans_amount: float (交易金额)
}
```
