# API Documents

## 목차

-   [Response Example](#response-example)
-   [Customer, 고객](#customer-고객)
    -   [Check Duplicate Email](#get---check-duplicate-email)
    -   [Sign In](#post---sign-in)
    -   [Sign Out](#post---sign-out)
    -   [Sign Up](#post---sign-out)
-   [Product, 상품](#product-상품)
    -   [Add](#post---add)
    -   [Update](#post---update)
-   [Order, 주문](#order-주문)
    -   [History](#get---history)
    -   [Purchase](#post---purchase)
    -   [Refund](#post---refund)
-   [Store, 상점](#store-상점)
    -   [Detail](#get---detail)
    -   [Add](#post---add-1)
    -   [Update](#post---update-1)
-   [Models](#models)
    -   [Customer Model](#customer-model)
    -   [Product Model](#product-model)
    -   [Order Model](#order-model)
    -   [Store Model](#store-model)
    -   [Model Custom](#model-custom)
    -   [Store Custom](#store-custom)

<br></br>

# Response Example

### Default Response

```
{
    "data": {
        responseData
    }
}
```

### Error Response

```
{
    "error": {
        "code": Defined Error Code,
        "statusCode": HTTP Status Code,
        "message": Defined Error Message
    }
}
```

<br></br>

# Customer, 고객

## GET - Check Duplicate Email

```
~/customer/check-duplicate-email
```

입력된 이메일이 이미 존재하는 경우 `true`를 반환합니다. 존재하지 않는 경우 `false`를 반환합니다.

### Parameters

| Key   | Type   | Description   |
| ----- | ------ | ------------- |
| store | String | 상점 ID       |
| email | String | 사용할 이메일 |

### Response

| Key    | Type    | Description                      |
| ------ | ------- | -------------------------------- |
| result | Boolean | 입력으로 받은 이메일의 존재 여부 |

<br></br>

## POST - Sign In

```
~/customer/sign-in
```

입력받은 이메일과 비밀번호로 로그인을 진행합니다. 로그인 성공시 고객 정보를 반환합니다. 로그인 실패시 에러를 반환합니다.

### Parameters

| Key      | Type   | Description  |
| -------- | ------ | ------------ |
| store    | String | 상점 고유 ID |
| email    | String | 이메일       |
| password | String | 비밀번호     |

### Response

| Key    | Type                                  | Description                  |
| ------ | ------------------------------------- | ---------------------------- |
| id     | String                                | 고객 ID                      |
| store  | String                                | 상점 ID                      |
| name   | String                                | 고객 이름                    |
| email  | String                                | 고객 이메일                  |
| custom | Array\<[ModelCustom](#model-custom)\> | 고객 모델의 사용자 정의 필드 |

<br></br>

## POST - Sign Out

```
~/customer/sign-out
```

로그인된 계정의 로그아웃을 진행합니다.

### Parameters

없음

### Response

| Key    | Type    | Description        |
| ------ | ------- | ------------------ |
| result | Boolean | 로그아웃 성공 여부 |

<br></br>

## POST - Sign Up

```
~/customer/sign-up
```

입력받은 정보로 회원가입을 진행합니다. 성공 여부를 반환합니다.

### Parameters

| Key      | Type                                  | Description                  |
| -------- | ------------------------------------- | ---------------------------- |
| store    | String                                | 상점 고유 ID                 |
| name     | String                                | 고객 이름                    |
| email    | String                                | 이메일                       |
| password | String                                | 비밀번호                     |
| custom   | Array\<[ModelCustom](#model-custom)\> | 고객 모델의 사용자 정의 필드 |

### Response

| Key    | Type    | Description        |
| ------ | ------- | ------------------ |
| result | Boolean | 회원가입 성공 여부 |

<br></br>

# Product, 상품

## POST - Add

```
~/product/add
```

상점의 상품을 추가합니다.

### Parameters

| Key        | Type                                  | Description                  |
| ---------- | ------------------------------------- | ---------------------------- |
| store      | String                                | 상점 고유 ID                 |
| name       | String                                | 상품 이름                    |
| price      | String                                | 상품 가격                    |
| categories | String                                | 상품 카테고리 목록           |
| custom     | Array\<[ModelCustom](#model-custom)\> | 상품 모델의 사용자 정의 필드 |

### Response

| Key    | Type    | Description         |
| ------ | ------- | ------------------- |
| result | Boolean | 상품 추가 성공 여부 |

<br></br>

## POST - Update

```
~/product/update
```

상점의 상품을 수정합니다.

### Parameters

| Key        | Type                                  | Description                  |
| ---------- | ------------------------------------- | ---------------------------- |
| id         | String                                | 상품 고유 ID                 |
| store      | String                                | 상점 고유 ID                 |
| name       | String                                | 상품 이름                    |
| price      | String                                | 상품 가격                    |
| categories | String                                | 상품 카테고리 목록           |
| custom     | Array\<[ModelCustom](#model-custom)\> | 상품 모델의 사용자 정의 필드 |

### Response

| Key    | Type    | Description         |
| ------ | ------- | ------------------- |
| result | Boolean | 상품 수정 성공 여부 |

<br></br>

# Order, 주문

## GET - History

```
~/order/
```

고객의 주문 내역들을 반환합니다.

### Parameters

없음

### Response

| Key  | Type                                | Description           |
| ---- | ----------------------------------- | --------------------- |
| list | Array\<[OrderModel](#order-model)\> | 고객의 주문 내역 배열 |

<br></br>

## POST - Purchase

```
~/order/purchase
```

선택한 상품들을 주문합니다.

### Parameters

| Key      | Type                                  | Description                  |
| -------- | ------------------------------------- | ---------------------------- |
| store    | String                                | 상점 고유 ID                 |
| products | Array\<String\>                       | 상품 고유 ID 목록            |
| custom   | Array\<[ModelCustom](#model-custom)\> | 주문 모델의 사용자 정의 필드 |

### Response

| Key    | Type    | Description    |
| ------ | ------- | -------------- |
| result | Boolean | 주문 성공 여부 |

<br></br>

## POST - Refund

```
~/order/refund
```

선택한 주문을 환불합니다.

### Parameters

| Key | Type   | Description  |
| --- | ------ | ------------ |
| id  | String | 주문 고유 ID |

### Response

| Key    | Type    | Description         |
| ------ | ------- | ------------------- |
| result | Boolean | 주문 환불 성공 여부 |

<br></br>

# Store, 상점

## GET - Detail

```
~/store/
```

상점의 정보를 반환합니다.

### Parameters

| Key | Type   | Description    |
| --- | ------ | -------------- |
| id  | String | 상점의 고유 ID |

### Response

| Key      | Type                                    | Description                    |
| -------- | --------------------------------------- | ------------------------------ |
| id       | String                                  | 상점 고유 ID                   |
| name     | String                                  | 상점 이름                      |
| products | Array\<[ProductModel](#product-model)\> | 상점의 상품 목록               |
| custom   | [StoreCustom](#store-custom)            | 상점에 정의된 사용자 정의 필드 |

<br></br>

## POST - Add

```
~/store/add
```

상점을 추가합니다. 추가된 상점의 정보를 반환합니다.

### Parameters

| Key    | Type                         | Description      |
| ------ | ---------------------------- | ---------------- |
| name   | String                       | 상점 이름        |
| custom | [StoreCustom](#store-custom) | 사용자 정의 필드 |

### Response

| Key    | Type                         | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| id     | String                       | 상점 고유 ID                   |
| name   | String                       | 상점 이름                      |
| custom | [StoreCustom](#store-custom) | 상점에 정의된 사용자 정의 필드 |

<br></br>

## POST - Update

```
~/store/update
```

상점을 수정합니다. 수정된 상점의 정보를 반환합니다.

### Parameters

| Key    | Type                         | Description      |
| ------ | ---------------------------- | ---------------- |
| id     | String                       | 상점 고유 ID     |
| name   | String                       | 상점 이름        |
| custom | [StoreCustom](#store-custom) | 사용자 정의 필드 |

### Response

| Key    | Type                         | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| id     | String                       | 상점 고유 ID                   |
| name   | String                       | 상점 이름                      |
| custom | [StoreCustom](#store-custom) | 상점에 정의된 사용자 정의 필드 |

<br></br>
<br></br>

# Models

## Customer Model

고객 모델

| Key      | Type                                  | Description                  |
| -------- | ------------------------------------- | ---------------------------- |
| id       | String                                | 고객 고유 ID                 |
| store    | String                                | 상점 고유 ID                 |
| name     | String                                | 고객 이름                    |
| email    | String                                | 이메일                       |
| password | String                                | 비밀번호                     |
| custom   | Array\<[ModelCustom](#model-custom)\> | 고객 모델의 사용자 정의 필드 |

<br></br>

## Product Model

상품 모델

| Key        | Type                                  | Description                  |
| ---------- | ------------------------------------- | ---------------------------- |
| id         | String                                | 상품 고유 ID                 |
| store      | String                                | 상점 고유 ID                 |
| name       | String                                | 상품 이름                    |
| price      | Number                                | 상품 가격                    |
| categories | Array\<String\>                       | 상품 카테고리 목록           |
| custom     | Array\<[ModelCustom](#model-custom)\> | 상품 모델의 사용자 정의 필드 |

<br></br>

## Order Model

주문 모델

| Key      | Type                                  | Description                  |
| -------- | ------------------------------------- | ---------------------------- |
| id       | String                                | 주문 고유 ID                 |
| store    | String                                | 상점 고유 ID                 |
| status   | String                                | 주문 상태                    |
| customer | String                                | 고객 고유 ID                 |
| products | Array\<String\>                       | 상품 고유 ID 목록            |
| price    | Number                                | 주문 총액                    |
| custom   | Array\<[ModelCustom](#model-custom)\> | 고객 모델의 사용자 정의 필드 |

<br></br>

## Store Model

상점 모델

| Key    | Type                         | Description      |
| ------ | ---------------------------- | ---------------- |
| id     | String                       | 상점 고유 ID     |
| name   | String                       | 상점 이름        |
| custom | [StoreCustom](#store-custom) | 사용자 정의 필드 |

<br></br>

## Model Custom

상점에 정의된 사용자 정의 필드에 해당하는 값

| Key   | Type   | Description                                            |
| ----- | ------ | ------------------------------------------------------ |
| key   | String | [StoreCustom](#store-custom)에 정의된 사용자 정의 필드 |
| value | any    | 사용자 정의 필드의 값                                  |

```
{
    "key": ${key}, // String
    "value": ${value} // any
}
```

<br></br>

## Store Custom

상점에 정의된 사용자 정의 필드

| Key      | Type            | Description                                                |
| -------- | --------------- | ---------------------------------------------------------- |
| CUSTOMER | Array\<String\> | [고객 모델](#customer-model)에서 사용되는 사용자 정의 필드 |
| PRODUCT  | Array\<String\> | [상품 모델](#product-model)에서 사용되는 사용자 정의 필드  |
| ORDER    | Array\<String\> | [주문 모델](#order-model)에서 사용되는 사용자 정의 필드    |

```
{
    "CUSTOMER": ["", "", ...], // Array<String>
    "PRODUCT": ["", "", ...],
    "ORDER": ["", "", ...]
}
```
