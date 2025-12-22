import { useState } from "react";

const AccountSettingsForm: React.FC = () => {
  // Upload image
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Account card state
  const [sellerDisplayName, setSellerDisplayName] = useState<string>("TrezoStore");
  const [timezone, setTimezone] = useState<string>("UTC-05:00");
  const [defaultCurrency, setDefaultCurrency] = useState<string>("USD");
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmationText, setConfirmationText] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle deactivation confirmation
  const handleDeactivateAccount = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDeactivation = () => {
    // Show success toast
    showToast("Designer account has been deactivated", "success");
    setShowConfirmModal(false);
    setConfirmationText("");
  };

  const handleCancelDeactivation = () => {
    setShowConfirmModal(false);
    setConfirmationText("");
  };

  // Simple toast implementation
  const showToast = (message: string, type: 'success' | 'error') => {
    console.log(`Toast: ${type.toUpperCase()} - ${message}`);
    // Create a simple toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-[60] px-4 py-2 rounded-md text-white font-medium ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } shadow-lg transition-all duration-300`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const isConfirmationValid = confirmationText === "DEACTIVATE";

  return (
    <>
      {/* Account Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md mb-[20px] md:mb-[25px]">
        <div className="trezo-card-header mb-[20px] md:mb-[25px]">
          <h5 className="!text-lg !mb-[6px]">Account</h5>
          <p className="mb-0">
            Manage your seller account settings and preferences.
          </p>
        </div>

        <form>
          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            {/* Seller Display Name */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Seller Display Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="Enter your seller display name"
                value={sellerDisplayName}
                onChange={(e) => setSellerDisplayName(e.target.value)}
              />
            </div>

            {/* Timezone */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Timezone
              </label>
              <select
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
                <option value="UTC-11:00">(UTC-11:00) Coordinated Universal Time-11</option>
                <option value="UTC-10:00">(UTC-10:00) Hawaii</option>
                <option value="UTC-09:00">(UTC-09:00) Alaska</option>
                <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
                <option value="UTC-03:00">(UTC-03:00) Brasilia</option>
                <option value="UTC-02:00">(UTC-02:00) Coordinated Universal Time-02</option>
                <option value="UTC-01:00">(UTC-01:00) Azores</option>
                <option value="UTC+00:00">(UTC+00:00) Greenwich Mean Time</option>
                <option value="UTC+01:00">(UTC+01:00) Central European Time</option>
                <option value="UTC+02:00">(UTC+02:00) Eastern European Time</option>
                <option value="UTC+03:00">(UTC+03:00) Moscow</option>
                <option value="UTC+04:00">(UTC+04:00) Gulf Standard Time</option>
                <option value="UTC+05:00">(UTC+05:00) Pakistan Standard Time</option>
                <option value="UTC+06:00">(UTC+06:00) Bangladesh Standard Time</option>
                <option value="UTC+07:00">(UTC+07:00) Thailand Standard Time</option>
                <option value="UTC+08:00">(UTC+08:00) China Standard Time</option>
                <option value="UTC+09:00">(UTC+09:00) Japan Standard Time</option>
                <option value="UTC+10:00">(UTC+10:00) Australian Eastern Time</option>
                <option value="UTC+11:00">(UTC+11:00) Solomon Islands Time</option>
                <option value="UTC+12:00">(UTC+12:00) New Zealand Standard Time</option>
              </select>
            </div>

            {/* Default Currency */}
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Default Currency
              </label>
              <select
                className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white"
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="KRW">KRW - South Korean Won</option>
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="HKD">HKD - Hong Kong Dollar</option>
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-[30px] md:mt-[35px]">
            <h6 className="text-lg font-medium text-red-600 dark:text-red-400 mb-[15px]">
              Danger Zone
            </h6>
            <div className="border border-red-200 dark:border-red-800 rounded-md p-[20px] bg-red-50 dark:bg-red-900/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h6 className="text-md font-medium text-red-700 dark:text-red-400 mb-2">
                    Deactivate Designer Account
                  </h6>
                  <p className="text-red-600 dark:text-red-300 text-sm">
                    Once you deactivate your account, you will lose access to all designer features and cannot receive new projects.
                  </p>
                </div>
                <button
                  type="button"
                  className="font-medium inline-block transition-all rounded-md py-[10px] px-[20px] bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
                  onClick={handleDeactivateAccount}
                >
                  Deactivate Designer Account
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Solid background overlay */}
          <div className="absolute inset-0 bg-slate-900" />

          {/* Modal content */}
          <div className="relative bg-slate-900 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-700">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/20 mb-4">
                <i className="material-symbols-outlined text-red-400 text-[24px]">
                  warning
                </i>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Deactivate Designer Account
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                This action will deactivate your designer account and remove access to all design tools and projects. You will not be able to receive new project assignments.
              </p>

              {/* Confirmation text input */}
              <div className="mb-6 text-left">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type <span className="font-mono font-bold text-red-400">DEACTIVATE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  placeholder="Type DEACTIVATE here"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  className="font-medium inline-block transition-all rounded-md py-[8px] px-[16px] bg-slate-700 text-slate-300 hover:bg-slate-600"
                  onClick={handleCancelDeactivation}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`font-medium inline-block transition-all rounded-md py-[8px] px-[16px] ${
                    isConfirmationValid
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                  onClick={handleConfirmDeactivation}
                  disabled={!isConfirmationValid}
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Profile Card */}
      <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
        <form>
          <h5 className="!text-lg !mb-[6px]">Profile</h5>
          <p className="mb-[20px] md:mb-[25px]">
            Update your photo and personal details here.
          </p>

          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                First Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="Olivia"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Last Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="John"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Email Address
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="olivia@trezo.com"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Phone Number
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="+1 444 555 6699"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Address
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="84 S. Arrowhead Court Branford"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Country
              </label>
              <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                <option value="0">Select</option>
                <option value="1">Switzerland</option>
                <option value="2">New Zealand</option>
                <option value="3">Germany</option>
                <option value="4">United States</option>
                <option value="5">Japan</option>
                <option value="6">Netherlands</option>
                <option value="7">Sweden</option>
                <option value="8">Canada</option>
                <option value="9">United Kingdom</option>
                <option value="10">Australia</option>
              </select>
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Date Of Birth
              </label>
              <input
                type="date"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="1987-01-08"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Gender
              </label>
              <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                <option value="0">Select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Custom</option>
              </select>
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Your Skills
              </label>
              <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                <option value="0">Select</option>
                <option value="1">Leadership</option>
                <option value="2">Project Management</option>
                <option value="3">Data Analysis</option>
                <option value="4">Teamwork</option>
                <option value="5">Web Development</option>
              </select>
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Your Profession
              </label>
              <select className="h-[55px] rounded-md border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[13px] block w-full outline-0 cursor-pointer transition-all focus:border-primary-500 text-black dark:text-white">
                <option value="0">Select</option>
                <option value="1">Financial Manager</option>
                <option value="2">IT Manager</option>
                <option value="3">Software Developer</option>
                <option value="4">Physician Assistant</option>
                <option value="5">Data Scientist</option>
              </select>
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Company Name
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="Trezo Admin"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Company Website
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="http://website.com/"
              />
            </div>

            <div className="sm:col-span-2 mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Add Your Bio
              </label>
              <textarea
                className="h-[140px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] p-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                placeholder="It makes me feel..."
              ></textarea>
            </div>
          </div>

          <h5 className="!text-lg !mb-[6px] !mt-[20px] md:!mt-[25px]">Profile</h5>
          <p className="mb-[20px] md:mb-[25px]">
            This will be displayed on your profile.
          </p>

          <div id="fileUploader">
            <div className="relative flex items-center justify-center overflow-hidden rounded-md py-[88px] px-[20px] border border-gray-200 dark:border-[#172036]">
              <div className="flex items-center justify-center">
                <div className="w-[35px] h-[35px] border border-gray-100 dark:border-[#15203c] flex items-center justify-center rounded-md text-primary-500 text-lg ltr:mr-[12px] rtl:ml-[12px]">
                  <i className="ri-upload-2-line"></i>
                </div>
                <p className="leading-[1.5]">
                  <strong className="text-black dark:text-white">
                    Click to upload
                  </strong>
                  <br /> you file here
                </p>
              </div>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="absolute top-0 left-0 right-0 bottom-0 rounded-md z-[1] opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>

            {/* Image Previews */}
            <div className="mt-[10px] flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative w-[50px] h-[50px]">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="product-preview"
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-[-5px] right-[-5px] bg-orange-500 text-white w-[20px] h-[20px] flex items-center justify-center rounded-full text-xs rtl:right-auto rtl:left-[-5px]"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <h5 className="!text-lg !mb-[20px] !mt-[20px] md:!mt-[25px]">
            Socials Profile
          </h5>
          <div className="sm:grid sm:grid-cols-2 sm:gap-[25px]">
            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                Facebook
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="https://www.facebook.com/"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                X
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="https://x.com/"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                LinkedIn
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="https://www.linkedin.com/"
              />
            </div>

            <div className="mb-[20px] sm:mb-0">
              <label className="mb-[10px] text-black dark:text-white font-medium block">
                YouTube
              </label>
              <input
                type="text"
                className="h-[55px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[17px] block w-full outline-0 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary-500"
                defaultValue="https://www.youtube.com/"
              />
            </div>
          </div>

          <div className="mt-[20px] md:mt-[25px]">
            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md ltr:mr-[15px] rtl:ml-[15px] py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-danger-500 text-white hover:bg-danger-400"
            >
              Cancel
            </button>

            <button
              type="button"
              className="font-medium inline-block transition-all rounded-md md:text-md py-[10px] md:py-[12px] px-[20px] md:px-[22px] bg-primary-500 text-white hover:bg-primary-400"
            >
              <span className="inline-block relative ltr:pl-[29px] rtl:pr-[29px]">
                <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
                  check
                </i>
                Update Profile
              </span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AccountSettingsForm;
