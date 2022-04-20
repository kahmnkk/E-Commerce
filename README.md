# E-Commerce

E-Commerce 서비스
누구나 상점을 개설하고 상품을 판매할 수 있는 e-commerce 서비스

<br></br>

## Architecture

![Architecture](https://user-images.githubusercontent.com/35136024/163167660-681a2923-b4f0-4c6b-b9d5-39b8ab4616b8.png)

-   E-Commerce 서비스는 서비스 특성상 데이터의 조회가 매우 빈번하게 이루어집니다. 모든 조회를 RDBMS만으로 처리할 경우 트래픽이 너무 몰려 MySQL에 부담을 줄 수 있습니다. 따라서 서비스 기능 중 조회가 많이 불리는 Store(상점)과 Product(상품) 데이터를 RDBMS보다 속도가 빠른 Redis를 사용하여 캐싱했습니다. 이로서 빈번히 호출되는 조회 요청을 Redis로 분산하여 보다 빠르고 안정적으로 서비스를 운영할 수 있습니다.

-   MySQL과 Redis를 여러개로 분리하여 개발할 수 있도록 구조를 설계했습니다. 따라서 추후에 서비스가 확장되어 여러 테이블이 필요하거나 트래픽을 분산할 때 쉽게 분리하여 개발할 수 있습니다.

<br></br>

## ERD

![ERD](https://user-images.githubusercontent.com/35136024/163226386-058a6b94-3d59-48e3-b279-5a62763e40df.png)

-   MySQL의 tb_commmerce_store(상점) 테이블에서 '사용자 정의 필드'를 정의합니다.
-   나머지 모델(상품, 고객, 주문)은 상점 테이블에 정의된 '사용자 정의 필드'의 값을 저장합니다.

<br></br>

## RESTful API Document

-   [API Docs](https://github.com/kahmnkk/six-shop/blob/main/API_Docs.md)
