import DataLoader from 'dataloader';
import { Cut } from '../entities/Cut';
import { CutVote } from '../entities/CutVote';
import { In } from 'typeorm';

// cutId의 타입을 Cut 엔티티에서 가져온다.
type CutVoteKey = {
  cutId: Cut['id'];
};

// <CutVoteKey, CutVote[]>
//  첫 번째 타입 인자: DataLoader가 요청을 받을 때 사용하는 "키" 타입 정의 { cutId: number } CutVoteKey 객체
//  두 번째 타입 인자: DataLoader가 반환할 "값"의 타입 정의 각 CutVoteKey에 해당하는 CutVote 객체의 배열
// DataLoader 클래스는 제네릭을 지원하므로 더 안전한 코딩을 위해 제네릭을 구성
// 첫 번째 타입 파라미터는 데이터의 키로 사용될 keys의 타입
// 두 번째 타입 파라미터는 반환될 데이터의 타입으로
// cutId 필드를 갖는 CutVoteKey 타입을 구성했고, 이를 첫 번째 타입 파라미터로 입력
// 반환되는 데이터는 CutVote[]와 같이, 명장면 좋아요 데이터의 배열로 설정
export const createCutVoteLoader = (): DataLoader<CutVoteKey, CutVote[]> => {
  // 비동기 함수로 keys 받아 처리, DataLoader는 주어진 keys를 한 번에 처리하기 위해 keys 배열을 비동기적으로 받아온다.
  return new DataLoader<CutVoteKey, CutVote[]>(async (keys) => {
    console.log('keys: ', keys);
    // cutId 배열 생성 예를 들어 keys가 [{ cutId:1 }, { cutId: 2}]라면 cutIds는 [1, 2]가 된다.
    const cutIds = keys.map((key) => key.cutId);
    console.log('cutId 배열 생성 cutIds: ', cutIds);
    // CutVote 엔티티 찾기
    // cutId가 cutIds 배열에 포함된 모든 CutVote를 가져온다. In 키워드를 사용해 여러 개의 cutId를 한 번에 조회할 수 있다.
    const votes = await CutVote.find({ where: { cutId: In(cutIds) } });
    // SQL 쿼리 실행 됨 (?,?,?) 부분에 배열 전달 됨
    console.log('CutVote 엔티티 찾기 votes: ', votes);
    // 결과 매핑
    // keys의 각 cutId에 해당하는 CutVote 배열을 만들기 위해 vote.filter() 사용
    const result = keys.map((key) => votes.filter((vote) => vote.cutId === key.cutId));
    console.log('결과 매핑 result: ', result);
    return result;
  });
};

// 이렇게 구성했을 때 TypeORM에 의해 만들어진 SQL 쿼리는 다음과 같다.
// SELECT `CutVote`.`userId` AS `CutVote_userId`, `CutVote`.`cutId` AS `CutVote_cutId` FROM `cut_vote``CutVote`WHERE `CutVote`.`cutId`IN (?, ?, ?)
// SQL 쿼리에서 열 이름이나 테이블 이름에 특수 문자가 포함되었거나 예약어와 충돌하는 경우 해당 이름을 감싸기 위해 사용됨
// 백틱의 주요 용도: SQL 예약어와 구분, 특수 문자나 공백 포함 시 사용, 대소문자 구분을 명확히
// SECLECT 절: CutVote.userId와 CutVote.cutId 열을 가져오도록 지정
// FROM 절: 데이터가 저장된 테이블이 cut_vote임을 나타낸다. CutVote라는 별칭을 붙였기 때문에 이후 테이블을 참조할 때 CutVote로 사용할 수 있다.
