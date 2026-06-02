const bcrypt = require('bcrypt');
bcrypt.compare('admin123', '$2b$10$H/AOAjtzEYKv6YUXFGaVcOF.FeiPI4trQdCOOHcEZJOBUL7EGlm5ojC').then(console.log);
