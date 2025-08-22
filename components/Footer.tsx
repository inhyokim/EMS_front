/**
 * Footer Component
 * 심플하고 미니멀한 푸터
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-white safe-bottom">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 space-y-4 sm:space-y-0">
          {/* 저작권 정보 */}
          <div className="text-sm text-gray-500">
            © {currentYear} EMS. All rights reserved.
          </div>

          {/* 추가 정보 */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-gray-700 transition-colors duration-200 cursor-pointer">
              Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}