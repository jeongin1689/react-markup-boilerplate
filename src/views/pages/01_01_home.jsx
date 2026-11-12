import { Button } from '../include/components/index.js'
import { PageFrame } from './PageShared.jsx'

export default function HomePage() {
  return (
    <PageFrame headerProps={{ title: '홈' }}>
      <section className="home">
        <h2>샘플 홈 화면</h2>
        <p>이 파일을 복사해서 새 화면을 만들면 돼.</p>
        <Button text="확인" />
      </section>
    </PageFrame>
  )
}
