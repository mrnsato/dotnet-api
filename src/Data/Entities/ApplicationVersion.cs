using System.ComponentModel.DataAnnotations.Schema;

namespace  Entities
{
            [Table("applications_versions")]
            public class ApplicationVersion {
            [Column("id")]
            public int Id { get; set; }
            [Column("application_id")]
            public int ApplicationId { get; set; }
            [Column("version_id")]
            public int VersionId { get; set; }

            public Application Application { get; set; } = null!;
            public Version Version { get; set; } = null!;
        }
}